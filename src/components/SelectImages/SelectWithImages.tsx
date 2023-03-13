import React, { useState } from 'react'
import { options } from '../../assets/data';
import { Arrow} from '../../assets/icons'
import "./style.css"

    interface SelectWithImagesProps {
        getNews(optionName: string): void;
    }
  
    const SelectWithImages: React.FunctionComponent<SelectWithImagesProps> = ({
        getNews,
    }: SelectWithImagesProps) => {

    const [languageOption, setLanguageOption] = useState<string>("Select Your News")
    const [hideSelect, setHideSelect] = useState(true)

    window.addEventListener('click', function(e: Event){
        const selectField = document.querySelector("#selectField");
        const target = e.target as HTMLButtonElement;
        if (selectField?.contains(target)){
          setHideSelect(!hideSelect)
        } else{
            setHideSelect(true)
        }
    });

    React.useEffect(() => {
        if(localStorage.getItem("languageSelected") === null){
            localStorage.setItem("languageSelected", languageOption)
        }else{
            setLanguageOption(localStorage.getItem("languageSelected") || "")
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                {options.map(option => (
                    <li className='options' onClick={() => clickOption(option.value, option.name)}>
                        <img src={option.img} alt={option.value}/>
                        <span>{option.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default SelectWithImages;