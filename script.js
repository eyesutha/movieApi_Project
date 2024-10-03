const optionMenu = document.querySelector(".select-menu"),
    selectBtn = optionMenu.querySelector(".select-btn"),
    optionsContainer = optionMenu.querySelector(".options"),
    sBtnText = optionMenu.querySelector(".sBtn-text");
const apiKey = 'ac4e614eed0bd385b910ac931949f7d8';
const imgBaseURL = 'http://image.tmdb.org/t/p/original';


const input = document.querySelector(".searchBox input");
const searchBtn = document.querySelector(".search-btn button");
const movieGrid = document.querySelector(".movie-grid");
const movieContainer = document.querySelector(".movie-container h1");


//genres btn//

async function fetchGenres() {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`);
        const data = await response.json();
        return data.genres;
    } catch (error) {
        console.error('Error fetching genres:', error);
    }
}

async function genreList () {
    const genres = await fetchGenres();
    if (!genres) return;

    optionsContainer.innerHTML = genres.map(genre => 
        `<div class="type" data-id="${genre.id}">
                <span class="type-text">${genre.name}</span>
        </div>
    `).join('');

    optionsContainer.style.display = 'block'; 
}

function dropdown() {
    if (optionsContainer.style.display === 'block') {
        optionsContainer.style.display = 'none';
    } else {
        genreList();
        optionsContainer.style.display = 'block';
    }
}

async function fetchMovieGenre(genreId) {
    try {
        const response = await fetch(`https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&api_key=${apiKey}`);
        const data = await response.json();
        return data.results;
    } catch (error) {
        console.error('Error fetching movies:', error);
        return [];
    }
}

optionsContainer.addEventListener("click", async (event) => {
    const target = event.target;
    if (target) {
        const genreId = target.dataset.id;
        const genreName = target.querySelector('.type-text').textContent;
        sBtnText.textContent = genreName;
        optionsContainer.style.display = 'none';

        const movies = await fetchMovieGenre(genreId);
        movieContainer.innerText = `Movies in ${genreName} :`;
        movieGrid.style.backgroundColor = "black";
        movieGrid.innerHTML = movies.map(movie => `
            <div class="movie" data-id="${movie.id}">
                <img class="imgmovie" src="${imgBaseURL + movie.poster_path}" alt="${movie.title}">
                <div class="info">
                    <h2>${movie.title}</h2>
                    <div class="infoText">
                        <span>Rate :</span>
                        <span>${movie.vote_average.toFixed(1)}</span>
                    </div>
                    <div class="infoText">
                        <span>Release Date :</span>
                        <span>${movie.release_date}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
});

window.addEventListener('click', (event) => {
    if (!optionMenu.contains(event.target)) {
        optionsContainer.style.display = 'none';
    }

});


// search box //

async function getMovie(title) {
    try {
        const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${title}&api_key=${apiKey}`);
        const resData = await res.json();
        return resData.results;
    } catch (error) {
        console.error('Error fetching movie data:', error);
        return [];
    }
}

searchBtn.addEventListener("click", async () => {
    const searchText = input.value;
    if (searchText === '') {
        movieContainer.innerText = 'Please enter a search query.';
        movieGrid.innerHTML = '';
        return;
    }

    const data = await getMovie(searchText);

    if (data.length === 0) {
        movieContainer.innerText = `No results found for "${searchText}".`;
        movieGrid.innerHTML = '';
    } else {
        movieContainer.innerText = `Results for ${searchText}...`;
        movieGrid.style.backgroundColor = "black";
        movieGrid.innerHTML = data.map(e => `
            <div class="movie" data-id="${e.id}">
                <img class="imgmovie" src="${imgBaseURL + e.poster_path}" alt="${e.title}">
                <div class="info">
                    <h2>${e.title}</h2>
                    <div class="infoText">
                        <span>Rate :</span>
                        <span>${e.vote_average.toFixed(1)}</span>
                    </div>
                    <div class="infoText">
                        <span>Release Date :</span>
                        <span>${e.release_date}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
});


selectBtn.addEventListener("click", dropdown);
selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));  
