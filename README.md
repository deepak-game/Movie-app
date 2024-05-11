# Features of movie

# F1: It have two section homepage and Favorite

# F2: Homepage we can search movie and add movie as Favorite. Homepage will show movie as suggestion result according to text we enter in search bar. Once we click on searcg button, the entered text is considered as final text and show movie according to the text.

# F3: Under Favorite Movie: We can see movies added as favorite. Movie under favorite is persistent with window close or page refresh.

# F4: Movie shown under homepage and movie shown under favorite

# have same data like name, img, year but button difference, one have Add To Favorite and other has Removite Favorite repectiely.

# F5: Click on add to favorite button will add respective movie in favorite section.

# F6: We have separate data array for homepage and favorite movie section ,with isFav field.

# F7: IsFav field is false by default, which mean it is not favorite under Homepage, and isFav is true in Favorite movie data which means movie is marked as favorite

# F8: Every time we click on addTofavorite or removeFavorite, isFav field changes to true or false and the hompage movie data and favorite page movie data array updated accordingly and will show movie on homepage or favorite accordingly.

# F9: If we mark any movie as favorite and next time if we search the same movie then search result will already show that movie as favorite. i.e. we cannot mark same movie twice or more as favorite.

# F10: If we click on any movie, other than AddToFavorite button, movie will shown in new tab with more details than homepage or favorite section movie. Movie appears on new tab have rating, plot as additional data. We have used other url to get these details.

# F11: We have not maintained any separate array like homepage movie and favorite movie to store whatever movie we are opening in new tab.
