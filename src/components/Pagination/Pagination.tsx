import React, { useState } from 'react';
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
  const [arrOfCurrButtons, setArrOfCurrButtons] = useState([])

  const threePoints = {
    first: "->",
    second: "<-",
    third: "->"
  }
  
  React.useEffect(() => {
    let tempNumberOfPages:any = [...arrOfCurrButtons]

    if (numberOfPages.length < 6) {
      tempNumberOfPages = numberOfPages
    }
    
    else if (currentPage >= 1 && currentPage <= 3) {
      tempNumberOfPages = [1, 2, 3, 4, threePoints.first, numberOfPages.length]
    }

    else if (currentPage === 4) {
      const sliced = numberOfPages.slice(0, 5)
      tempNumberOfPages = [...sliced, threePoints.first, numberOfPages.length]
    }

    else if (currentPage > 4 && currentPage < numberOfPages.length - 2) {               
      const sliced1 = numberOfPages.slice(currentPage - 2, currentPage)                
      const sliced2 = numberOfPages.slice(currentPage, currentPage + 1)                
      tempNumberOfPages = ([1, threePoints.second, ...sliced1, ...sliced2, threePoints.third, numberOfPages.length]) 
    }
    
    else if (currentPage > numberOfPages.length - 3) {              
      const sliced = numberOfPages.slice(numberOfPages.length - 4)      
      tempNumberOfPages = ([1, threePoints.second, ...sliced])                        
    }

    setArrOfCurrButtons(tempNumberOfPages)
    setCurrentPage(currentPage)
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage])

  return(
        <div className="pagination-container">
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

        {arrOfCurrButtons.map(((item, index) => {
            return <button
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
        }))}

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