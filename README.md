# dating-web-app

Project Name: Tundra - The Canadian Dating App

Link: http://gao00078.edumedia.ca/mad9022/tundra/index.html

Make sure to toggle the mobile device-mode in Chrome when viewing it.

App description: This is a two-page dating app. It fetches profiles data from server. The main page allows user to delete or save the profile as one of the favourite profiles. The second page shows a list of saved profiles.

Make a fetch to the provided php file on the server which will return a list of 6 random profiles.
When the fetch returns the data, save the array of profiles returned to a global profile array variable.

Interface Features
Display ONE profile at a time on the main page.
A swipe listener is added to each profile as they are added to the interface.
Swipe LEFT to DELETE. Profiles are removed from the global array and the interface if DELETED.
Swipe RIGHT to SAVE to localStorage. Profiles are removed from the global array and moved into localStorage.
I remove BOTH SWIPE listeners after either SWIPE gesture.(Zing Touch library)
I use the Ratchet CSS framework for my base styling. Then add my own CSS file for the colours and transitions.
Every time a profile is deleted or saved, it needs to be removed from BOTH my global array variable as well as the user interface. I added a CSS transition with opacity to make it disappear and then another item from the profile array is shown.
It should also be clear to the user what has happened after they swipe. It will display a message, to tell the user what they did by swiping.

Navigation & Layout
There is a navbar with two tabs at the bottom of the page. The two tabs  allow the user to toggle between the latest profiles (one at a time) and the profiles that have been saved in localStorage.
The profiles from the server should be shown one at a time. The profile image takes up the majority of the screen width with the name, distance and gender to the user displayed below the image
The profiles in localStorage are shown as a list view. The profile images for these ones are much smaller than the ones in the current list. The image is on the left and the name to the right. There is a delete icon to the RIGHT of the name.
Tap the delete icon to remove from localStorage and the interface. 

Adding New Profiles
Each time the user swipes a profile it is removed from the global array. When the size of the global profile array becomes less than three then a new fetch( ) to the URL should be make to fetch another 6 profiles.
