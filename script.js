window.onload = () => {
    getOriginals()
    getTrendingNow()
    getTopRated()
  }
  
  async function fetchMovies(url, dom_element, path_type) {
    response = await fetch(url)
    if(response.ok){
        data = await response.json()
    }else{
        throw `Something went wrong`
    }
    showMovies(data,dom_element, path_type)
  }
  
  const showMovies = (movies, dom_element, path_type) => {
    
  var movieL=document.getElementById(dom_element)
  
  for(let movie of movies.results){
    var img = document.createElement("img")
    img.setAttribute('data-id',movie.id)
    img.src = `https://image.tmdb.org/t/p/original${movie[path_type]}`
    img.addEventListener('click', e => {
      handleMovieSelection(e)
    })
    movieL.appendChild(img)
    }  
  }
   function getOriginals() {
  url='https://api.themoviedb.org/3/discover/tv?api_key=19f84e11932abbc79e6d83f82d6d1045&with_networks=213'
  fetchMovies(url,'original__movies','poster_path')
  }
   function getTrendingNow() {
    url='https://api.themoviedb.org/3/trending/movie/week?api_key=19f84e11932abbc79e6d83f82d6d1045'
    fetchMovies(url,'trending','poster_path')
  }
   function getTopRated() {
    url='https://api.themoviedb.org/3/movie/top_rated?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US&page=1'
    fetchMovies(url,'top_rated','poster_path')
  }
  
  
  async function getMovieTrailer(id) {
    var url = `https://api.themoviedb.org/3/movie/${id}/videos?api_key=19f84e11932abbc79e6d83f82d6d1045&language=en-US`
    return await fetch(url).then(response => {
      if (response.ok) {
        return response.json()
      } else {
        throw new Error('something went wrong')
      }
    })
  }
  
  const setTrailer = trailers => {
    const iframe = document.getElementById('movieTrailer')
    const movieNotFound = document.querySelector('.movieNotFound')
    if (trailers.length > 0) {
      movieNotFound.classList.add('d-none')
      iframe.classList.remove('d-none')
      iframe.src = `https://www.youtube.com/embed/${trailers[0].key}`
    } else {
      iframe.classList.add('d-none')
      movieNotFound.classList.remove('d-none')
    }
  }
  
  const handleMovieSelection = e => {
    const id = e.target.getAttribute('data-id')
    console.log(id)
    const iframe = document.getElementById('movieTrailer')
    // here we need the id of the movie
    getMovieTrailer(id).then(data => {
      const results = data.results
      const youtubeTrailers = results.filter(result => {
        if (result.site == 'YouTube' && result.type == 'Trailer') {
          return true
        } else {
          return false
        }
      })
      setTrailer(youtubeTrailers)
    })
  
    $('#trailerModal').modal('show')
  }
  
  
  