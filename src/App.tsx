import React from 'react';
import axios from "axios";
import CardComponent from './components/CardComponent/CardComponent';
import SelectWithImages from './components/SelectImages/SelectWithImages';
import Pagination from './components/Pagination/Pagination';
import { BASE_URL, MAIN_TITLE, options, PAGE_BUTTON } from './assets/data';
import './App.css';

function App() {

	const [loading, setLoading] = React.useState(false)
	const [pageButton, setPageButton] = React.useState("All")
	const [languageOption, setLanguageOption] = React.useState("")
	const [currentPage, setCurrentPage] = React.useState(1)
	const [currentFavPage, setCurrentFavPage] = React.useState(1)
	
	const [posts, setPosts] = React.useState([])
	const [howManyPages, setHowManyPages] = React.useState(10) 
	const [favorites, setFavorites] = React.useState([]) 
	const [showFavorites, setShowFavorites] = React.useState([]) 

	/*** 
		Check the selected option on the localStorage and make the API call based on the result, and fill the favorites.
		If the localstorage is empty, you need to select one option to see the data.
	*/
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

	/*** 
		DATA CARD FUNCTIONALITY
		* fillDataCard: Calls an API to fill tha data cards on the "All" Page, 
						also filter the data if the story_title, story_url, author, created_at are null
						(requires:
							- the option of the language select: string
							- the number of the page
							- the direction of the paginatioin (works for the infinite pagination buttons)
						)
	*/
	const fillDataCard = (optionName: string, page:number, direction: number = 1) => {
		setLoading(true)
		axios.get(BASE_URL, {
			params:{
				query: optionName.toLowerCase(),
				page: page - 1,
				hitsPerPage:8,
			}
		}).then((response) => {
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
			}
		});
	}

	/*** 
		FAVORITES FUNCTIONALITY
		* checkFavorite: Shows favorite icon on the card component 
						(returns a boolean depending if the favorite exists or not)
		* markAsFavorite: Add or delete a favorite from the localstorage favorite data (if the localstorage doesn't exist, create a new one)
		* fillFavorites: Reload the favorite data and go back to the first page.
	*/
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
	const markAsFavorite = (dataCard: any) => {
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

	/*** 
		REUSABLE COMPONENTS
		* Page Buttons ("All", "My faves")
		* Reusable Card Component (show different data depending on the Main Page Button)
	*/
	const PageButtons = () => {
		return(
			<div className='ad_selection'>
				{PAGE_BUTTON.map((btn, i) => (
					<button 
						key={`page-btn-${i}`}
						onClick={() => setPageButton(btn)} 
						className={`${pageButton === btn ? "selected-button" : "not-selected-button"}`}
					>
						{btn}
					</button>
				))}
			</div>
		)
	}
	const ReusableCardComponent = ({cardData} : any) => {
		return(
			<div className='ad_card-container'>
				{cardData.map((post: any, i:number) => (
					<CardComponent 
						key={`card-comp-${i}`}
						cardData={post}
						isFavorite={checkFavorite(post) || false} 
						sendFavorite={(dataCard) => markAsFavorite(dataCard)}
					/>
				))}
			</div>
		)
	}

	return (
		<div className="ad_page">
			<div className='ad_header-page'>
				<h1 className='ad_header-title'>{MAIN_TITLE}</h1>
			</div>

			<div className="ad_main-container">
				<div>
					{/** MAIN PAGE BUTTON **/}
					<PageButtons />

					{/** LANGUAGES SELECT **/}
					{pageButton ===  "All" && (
						<SelectWithImages
							getNews={(optionName) => {
							setCurrentPage(1)
							setLanguageOption(optionName)
							fillDataCard(optionName, 1)
							}}
						/>
					)}

					{/** CARD COMPONENT **/}
					<ReusableCardComponent 
						cardData = {pageButton ===  "All" ? posts : showFavorites}
					/>
				</div>

				{/** PAGINATION (depends on the Page Buttons)**/}
				{pageButton ===  "All" ? (
					<Pagination 
						loading={loading}
						pages={howManyPages}
						setCurrentPage={setCurrentPage} 
						currentPage={currentPage}
						sendCurrentPage={(page, direction) => {
							fillDataCard(languageOption, page, direction)
						}}
					/>
				) : (
					<>
						{showFavorites.length !== 0 && (
							<Pagination 
								loading={loading}
								pages={Math.ceil(favorites.length / 8)}
								setCurrentPage={setCurrentFavPage}
								currentPage={currentFavPage}
								sendCurrentPage={(page) => {
									let copyFav = [...favorites]
									setShowFavorites(copyFav.splice(((page-1) * 8), 8))

									if(page > Math.ceil(favorites.length / 8)){
										let lastPage = Math.ceil(favorites.length / 8)

										setShowFavorites(copyFav.splice(((lastPage - 1) * 8), 8))
										setCurrentFavPage(lastPage)
									}
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
