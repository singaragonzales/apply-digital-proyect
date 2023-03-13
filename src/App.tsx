import React, { useState } from 'react';
import axios from "axios";
import './App.css';
import CardComponent from './components/CardComponent';
import SelectWithImages from './components/SelectImages/SelectWithImages';
import Pagination from './components/Pagination/Pagination';
import { options } from './assets/data';

function App() {

  const url:string = 'https://hn.algolia.com/api/v1/search_by_date'

  const [selectedOption, setSelectedOption] = useState("All")
  const [languageOption, setLanguageOption] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [currentFavPage, setCurrentFavPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [posts, setPosts] = useState([])
  const [response, setResponse] = useState("")
  const [howManyPages, setHowManyPages] = useState(10) 
  const [favorites, setFavorites] = useState([]) 
  const [showFavorites, setShowFavorites] = useState([]) 

  const changeOptions = () => {
    setSelectedOption(selectedOption === "All" ? "My Faves" : "All")
  }

  React.useEffect(() => {
    if(localStorage.getItem("languageSelected") !== null && localStorage.getItem("languageSelected") !== "Select Your News"){
      const option = options.find(e => e.name === localStorage.getItem("languageSelected"));
      setLanguageOption(option?.value || "")
      fillDataCard(option?.value || "", 1)
    }
    setFavorites(JSON.parse(localStorage.getItem("favorites") || "[]"))
    setShowFavorites(JSON.parse(localStorage.getItem("favorites") || "[]").splice(0,8))
    // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


  const fillDataCard = (optionName: string, page:number, direction: number = 1) => {
    setLoading(true)
    axios.get(url, {
      params:{
        query: optionName.toLowerCase(),
        page: page - 1,
        hitsPerPage:8,
      }
    }
    ).then((response) => {
      let filterArray:any = []
      response.data.hits.forEach((data: any) => {
        if(data.story_url !== null && data.story_title !== null && data.author !== null && data.created_at !== null){
          filterArray.push(data)
        }
      })
      if(filterArray.length === 0){
        fillDataCard(languageOption, page + direction, direction)
        setCurrentPage(page + 1)
      }else{
        setLoading(false)
        setPosts(filterArray)
        setHowManyPages(response.data.nbPages)
        setResponse(response.data.query)
      }
    });
  }

  const checkFavorite = (data: any) => {
    if(localStorage.getItem("favorites") !== null){
      let favoritesParsed = JSON.parse(localStorage.getItem("favorites") || "")
      const option = favoritesParsed.find((e: any) => e.objectID === data?.objectID);
      if(option === undefined){
        return false
      }else{
        return true
      }
    }else{
      return false
    }
  }

  const markAsFavorite = (dataCard: any, favorite: boolean) => {
    if(localStorage.getItem("favorites") === null){
      let array:any = []
      array.push(dataCard)
      localStorage.setItem("favorites", JSON.stringify(array))

      fillFavorites(array)
    }else{
      let favoritesParsed = JSON.parse(localStorage.getItem("favorites") || "")
      const option = favoritesParsed.find((e: any) => e.objectID === dataCard?.objectID);
      if(option === undefined){
        favoritesParsed.push(dataCard)
        localStorage.setItem("favorites", JSON.stringify(favoritesParsed))

        fillFavorites(favoritesParsed)
      }else{
        let filterFavorites = favoritesParsed.filter((fav:any) => fav.objectID !== option.objectID); 
        localStorage.setItem("favorites", JSON.stringify(filterFavorites))

        fillFavorites(filterFavorites)
      }
    }
  }

  const fillFavorites = (data:any) => {
    let copyData:any = [...data]
    setFavorites(data)
    setShowFavorites(copyData.splice(0, 8))
    setCurrentFavPage(1)
  }

  return (
    <div className="ad_page">
      <div className='ad_header-page'>
        <h1 className='ad_header-title'>HACKER NEWS</h1>
      </div>
      <div className="ad_main-container">
        <div className='ad_selection'>
          <button onClick={() => changeOptions()} className={`${selectedOption === "All" ? "selected-button" : "not-selected-button"}`}>All</button>
          <button onClick={() => changeOptions()} className={`${selectedOption === "My Faves" ? "selected-button" : "not-selected-button"}`}>My Faves</button>
        </div>
        {selectedOption ===  "All" ? (
          <>
            <SelectWithImages 
              getNews={(optionName) => {
                setCurrentPage(1)
                setLanguageOption(optionName)
                fillDataCard(optionName, 1)
              }}
            />
            <div className='ad_card-container'>
              {posts.map((post) => (
                <CardComponent cardData={post}
                favorites={favorites}
                isFavorite={checkFavorite(post) || false} sendFavorite={(dataCard, favorite) => markAsFavorite(dataCard, favorite)}/>
              ))}
            </div>
            {response && (
              <Pagination 
                loading={loading}
                pages={howManyPages}
                setCurrentPage={setCurrentPage} 
                currentPage={currentPage}
                sendCurrentPage={(page, direction) => {
                  fillDataCard(languageOption, page, direction)
                }}
              />
            )}
          </>
        ) : (
          <>
            <div className='ad_card-container'>
              {showFavorites.map((post) => (
                <CardComponent cardData={post}
                favorites={favorites}
                isFavorite={checkFavorite(post) || false} sendFavorite={(dataCard, favorite) => markAsFavorite(dataCard, favorite)}/>
              ))}
            </div>
            {showFavorites.length !== 0 && (
              <Pagination 
                loading={loading}
                pages={Math.ceil(favorites.length / 8)}
                setCurrentPage={setCurrentFavPage} 
                currentPage={currentFavPage}
                sendCurrentPage={(page, direction) => {
                  let copyFav = [...favorites]
                  setShowFavorites(copyFav.splice(((page-1) * 8), 8))
                }}
              />
            )}
          </>
        )}
        
      </div>
    </div>
  );
}

export default App;
