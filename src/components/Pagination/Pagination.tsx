import React from 'react';
import { Arrow } from '../../assets/icons'
import "./style.css"

interface PaginationProps {
	pages:number;
	setCurrentPage: any;
	currentPage:number;
	loading: boolean;
	sendCurrentPage(page: number, direction: number): void;
}
const Pagination: React.FunctionComponent<PaginationProps> = ({
	pages,
	setCurrentPage,
	currentPage,
	loading,
	sendCurrentPage,
}: PaginationProps) => {

	//Set number of pages
	const numberOfPages:any = []
	for (let i = 1; i <= pages; i++) {
		numberOfPages.push(i)
	}

	// Array of buttons what we see on the page
	const [arrOfCurrButtons, setArrOfCurrButtons] = React.useState([])

	//Infinite buttons of the pagination
	const threePoints = {
		first: "->",
		second: "<-",
		third: "->"
	}

	/*** 
		Every time the current page change, the pagination reloads, active the new page and show the infinite buttons os the pagination
	*/
	React.useEffect(() => {
		let tempNumbersPg:any = [...arrOfCurrButtons]

		if (numberOfPages.length < 6) {
			tempNumbersPg = numberOfPages
		}
		
		else if (currentPage >= 1 && currentPage <= 3) {
			tempNumbersPg = [1, 2, 3, 4, threePoints.first, numberOfPages.length]
		}

		else if (currentPage === 4) {
			const sliced = numberOfPages.slice(0, 5)
			tempNumbersPg = [...sliced, threePoints.first, numberOfPages.length]
		}

		else if (currentPage > 4 && currentPage < numberOfPages.length - 2) {               
			const sliced1 = numberOfPages.slice(currentPage - 2, currentPage)                
			const sliced2 = numberOfPages.slice(currentPage, currentPage + 1)                
			tempNumbersPg = ([1, threePoints.second, ...sliced1, ...sliced2, threePoints.third, numberOfPages.length]) 
		}
		
		else if (currentPage > numberOfPages.length - 3) {              
			const sliced3 = numberOfPages.slice(numberOfPages.length - 4)      
			tempNumbersPg = ([1, threePoints.second, ...sliced3])                        
		}

		setArrOfCurrButtons(tempNumbersPg)
		setCurrentPage(currentPage)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentPage])

	return(
		<div className="pagination-container">
			{/** PREV BUTTON **/}
			<button
				disabled={loading}
				className={`${currentPage === 1 ? 'disabled' : ''}`}
				onClick={() => {
					if(currentPage !== 1){
						setCurrentPage(currentPage - 1)
						sendCurrentPage(currentPage - 1, -1)
					}
				}}
			>
				<img className="prev" alt='prev' src={Arrow}/>
			</button>

			{/** NUMBER BUTTONS **/}
			{arrOfCurrButtons.map((item, index) => (
				<button
					key={index}
					disabled={loading}
					className={`${currentPage === item ? 'active' : ''}`}
					onClick={() => {
					if(item === "->"){
						setCurrentPage(currentPage + 3)
						sendCurrentPage(currentPage + 3, 1)
					}
					else if(item === "<-"){
						setCurrentPage(currentPage - 3)
						sendCurrentPage(currentPage - 3, -1)
					}
					else{
						setCurrentPage(item)
						sendCurrentPage(item, 1)
					}
					}}
				>
					{item}
				</button>
			))}

			{/** NEXT BUTTON **/}
			<button
				disabled={loading}
				className={`${currentPage === numberOfPages.length ? 'disabled' : ''}`}
				onClick={() => {
					if(currentPage !== numberOfPages.length){
						setCurrentPage(currentPage + 1)
						sendCurrentPage(currentPage + 1, 1)
					}
				}}
			>
				<img className="next" alt='next' src={Arrow}/>
			</button>
		</div>
	)
}


export default Pagination