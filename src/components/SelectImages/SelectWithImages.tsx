import React from 'react'
import { options } from '../../assets/data';
import { Arrow} from '../../assets/icons'
import "./style.css"

interface SelectWithImagesProps {
    getNews(optionName: string): void;
}
const SelectWithImages: React.FunctionComponent<SelectWithImagesProps> = ({
    getNews,
}: SelectWithImagesProps) => {

    const [languageOption, setLanguageOption] = React.useState<string>("Select Your News")
    const [hideSelect, setHideSelect] = React.useState(true)

    /*** 
		CLICK EVENT LISTENER
		* A special select was implemented so that the options can be displayed with their corresponding icon, 
            this click listener allows the select to be closed when clicking outside the component.
	*/
    window.addEventListener('click', function(e: Event){
        const selectField = document.querySelector("#selectField");
        const target = e.target as HTMLButtonElement;
        if (selectField?.contains(target)){
          setHideSelect(!hideSelect)
        } else{
            setHideSelect(true)
        }
    });

    /*** 
		Fill the selected option based on the localStorage, in case you refresh the page.
	*/
    React.useEffect(() => {
        if(localStorage.getItem("languageSelected") === null){
            localStorage.setItem("languageSelected", languageOption)
        }else{
            setLanguageOption(localStorage.getItem("languageSelected") || "")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /*** 
		*clickOption: This function gets the new option of the select, 
                        saves it to localStorage and makes the API call based on the value.
                        (requires:
							- optionValue: the value of the selected option
							- optionName: the name of the option, to show it on the select.
						)
	*/
    const clickOption = (optionValue:string, optionName: string) => {
        setLanguageOption(optionName)
        localStorage.setItem("languageSelected", optionName)
        setHideSelect(!hideSelect)
        getNews(optionValue)
    }

    return (
        <div className='selector'>
            <div id='selectField'>
                <div className='selectText'>
                    <span>{languageOption}</span>
                </div>
                <img className={hideSelect ? 'arrow-open' : "arrow-close"} src={Arrow} alt="arow"/>
            </div>
            <ul id='list' className={hideSelect ? 'open' : ""}>
                {options.map((option:any, i: number) => (
                    <li 
                        key={`select-lang${i}`}
                        className='options' 
                        onClick={() => clickOption(option.value, option.name)}
                    >
                        <img src={option.img} alt={option.value}/>
                        <span>{option.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SelectWithImages;