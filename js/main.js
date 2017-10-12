/*****************************************************************
File: main.js
Author: Kai Gao
Description: This is a dating app. Fetching profiles data from server, allowing user to delele or save profiles.
Here is the sequence of logic for the app
-use Ratchet as the app framework for 2 pages
-use push.js as engin to load different pages when tapping on page links
-on page one, 
in showFirstProfileOnPageOne method, 
Fetching profiles data, saving in a global array and always showing the first profile in the the global array. Show picture, name, distance, gender information.
adding Zingtouch swipe listener. Depending on the angle of swiping, if swiping to the left, remove from global array and the interface(html elements), show the delete message, remove the swipe listener and the call  showFirstProfileOnPageOne method itself to show next profile.
if swiping to the right, remove it from the global array and move it to local storage, show save message, remove the swipe listener.
- On page two,
In two.html file, use table-view class from Ratchet, in js file, create list item add  class name table-view-cell and media
adding Zingtouch tap listener.
Combine profile first name and last name as matching index to find the match in locastorage list

Version: 0.0.1
Updated: Feb 24, 2017
*****************************************************************/
window.addEventListener("push", function (ev) {
    //determine the page, which page I am on. ev is the push event
    let contentDiv = ev.currentTarget.document.querySelector(".content");
    let id = contentDiv.id; // contentDiv.getAttribute("id);
    //pages need to be unique
    switch (id) {
    case "home":
        //do something for page main
        //        getProfiles();
        showFirstProfileOnPageOne();
        break;
    case "two":
        //do something for page two
        showAllSavedOnPageTwo();
        break;
    default:
        //do the home page thing
        showFirstProfileOnPageOne();
    }
});
var localStorageList = [];
let gender = ""; //female or male or blank for both
let url = "http://griffis.edumedia.ca/mad9022/tundra/get.profiles.php?gender=" + gender;
let profiles = [];
let imgurl;
let firstRun = false;

function getProfiles() {
    fetch(url).then(function (response) {
        return response.json();
    }).then(function (data) {
        if (profiles.length == 0) {
            firstRun = true;
        }
        imgurl = decodeURIComponent(data.imgBaseURL);
        profiles.push.apply(profiles, data.profiles);
        if (firstRun) {
            showFirstProfileOnPageOne();
        }
    }).catch(function (err) {
        alert(err.message);
    });
}
document.addEventListener('DOMContentLoaded', function () {
    getProfiles();
})

function showFirstProfileOnPageOne() {
    firstRun = false;
    let entirePage = document.querySelector("div.content");
    let activeRegion = ZingTouch.Region(entirePage);
    console.log("profiles.length: ");
    console.log(profiles.length);
    if (profiles.length < 3) {
        getProfiles();
    }
    let profile = document.createElement("div");
    profile.classList.add("oneProfile");
    profile.classList.add("fred");
    let img = document.createElement("img");
    img.src = imgurl + profiles[0].avatar;
    let pname = document.createElement("p");
    pname.classList.add("pname");
    pname.innerHTML = profiles[0].first + " " + profiles[0].last;
    let pdis = document.createElement("p");
    pdis.classList.add("pdis");
    pdis.innerHTML = profiles[0].distance;
    let pgender = document.createElement("p");
    if (profiles[0].gender == "male") {
        pgender.classList.add("male");
    }
    else {
        pgender.classList.add("female");
    }
    pgender.textContent = profiles[0].gender;
    profile.appendChild(img);
    profile.appendChild(pname);
    profile.appendChild(pdis);
    profile.appendChild(pgender);
    document.getElementById("slideshow").appendChild(profile);
    //bind element inside the region listen for swipe event
    activeRegion.bind(profile, 'pan', function (ev) {
        var swipeAngle = ev.detail.data[0].currentDirection;
        console.log(swipeAngle);
        if (swipeAngle >= 130 && swipeAngle <= 230) {
            //fadeout the profile
            profile.classList.add("bob");
            //delete message
            let p = document.createElement("p");
            p.classList.add("pdelete");
            p.innerHTML = "DELETED!";
            profile.parentElement.appendChild(p);
            //delete
            profiles.splice(0, 1);
            profile.parentElement.removeChild(profile);
            setTimeout(function () {
                p.parentElement.removeChild(p);
            }, 1000);
            activeRegion.unbind(profile, 'pan');
            setTimeout(function () {
                showFirstProfileOnPageOne();
            }, 1000);
        }
        else if (swipeAngle <= 40 || swipeAngle >= 320) {
            //fadeout the profile
            profile.classList.add("bob");
            //save message
            let p = document.createElement("p");
            p.classList.add("psave");
            p.innerHTML = "Saved!";
            profile.parentElement.appendChild(p);
            //save to localStorage
            console.log(profiles[0].first);
            if (!localStorageList) {
                localStorageList = [];
            }
            localStorageList.push(profiles[0]);
            localStorage.setItem("gao00078", JSON.stringify(localStorageList));
            profiles.splice(0, 1);
            profile.parentElement.removeChild(profile);
            activeRegion.unbind(profile, 'pan');
            //            showFirstProfileOnPageOne();
            setTimeout(function () {
                p.parentElement.removeChild(p);
            }, 1000);
            setTimeout(function () {
                showFirstProfileOnPageOne();
            }, 1000);
        }
    });
}

function showAllSavedOnPageTwo() {
    localStorageList = JSON.parse(localStorage.getItem("gao00078"));
    if (!localStorageList) {
        localStorageList = [];
    }
    localStorageList.forEach(function (person) {
        let li = document.createElement("li");
        li.classList.add("table-view-cell");
        li.classList.add("media");
        let ul = document.querySelector("div.content-padded ul.table-view");
        let span = document.createElement("span");
        span.classList.add("media-object");
        span.classList.add("pull-right");
        span.classList.add("icon");
        span.classList.add("icon-trash");
        let div = document.createElement("div");
        div.classList.add("media-body");
        let img = document.createElement("img");
        img.src = imgurl + person.avatar;
        let p = document.createElement("p");
        let name = "".concat(person.first, " ", person.last);
        p.appendChild(img);
        p.innerHTML += " " + name;
        //give this information for delete function to find the mathc in localstorage
        let fullNameNoSpcace = person.first + person.last;
        p.classList.add(fullNameNoSpcace);
        div.appendChild(p);
        li.appendChild(span);
        li.appendChild(div);
        ul.appendChild(li);
    });
    let entirePage = document.querySelector("div.content");
    let activeRegion = ZingTouch.Region(entirePage);
    let deleteButtons = document.querySelectorAll(".icon-trash");
    deleteButtons.forEach(function (deleteButton) {
        console.log("enter loop");
        activeRegion.bindOnce(deleteButton, 'tap', deleteProfile);
        //another way to unbind the tap listener is to create 2 global activeRegion varible.
    });
}

function deleteProfile(ev) {
    //remove the profile from the localstorage
    // activeRegion.unbind(ev.currentTarget, 'tap');
    //get the profile list item where its delele span is clicked
    // let li = ev.currentTarget.parentElement;
    // use span to get p. p is inside of li. use p's classname(adding fullnameNospace as classname when creating element p) to match the element in localstorage
    let p = ev.currentTarget.nextElementSibling.children; //nextElementSibling is div with classname media-body
    let fullName = p[0].className;
    console.log(fullName);
    let index = -1;
    //lets find the index of the element that contains this name
    for (let i = 0, len = localStorageList.length; i < len; i++) {
        let fullNameInLocal = localStorageList[i].first + localStorageList[i].last;
        if (fullNameInLocal == fullName) {
            index = i;
            break;
        }
    }
    console.log("our index " + index);
    if (index > -1) {
        console.log("last one delete?");
        localStorageList.splice(index, 1); //removing that profile object
    }
    if (localStorageList.length > 0) {
        localStorage.setItem("gao00078", JSON.stringify(localStorageList));
    }
    else {
        localStorage.removeItem("gao00078");
    }
    //remove the profile from the interface
    ev.currentTarget.parentElement.parentElement.removeChild(ev.currentTarget.parentElement);
    //    activeRegion.unbind(deleteButton, 'tap') // how to unbind event listner
}
/*try promise*/
//var p = new Promise(function(resolve,reject){
//    if(profiles.length>0){
//        reject(profiles);
//    }else{
//        resolve(profiles);
//    }
//});
//
//p.then(function(result))
/*try promise*/