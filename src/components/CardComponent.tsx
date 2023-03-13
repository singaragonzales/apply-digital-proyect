import React from 'react'
import { Clock, Favorite, NoFavorite } from '../assets/icons';

interface CardComponentProps {
    cardData: any;
    isFavorite: boolean;
    sendFavorite(cardData: any, isFavorite: boolean): void;
}
const CardComponent: React.FunctionComponent<CardComponentProps> = ({
    cardData,
    isFavorite,
	sendFavorite
}: CardComponentProps) => {

	const getHoursDate = (date: string) => {
		var diff = (new Date().getTime() - new Date(date).getTime()) / 1000;
		diff /= 3600;
		let diference = Math.abs(Math.round(diff))
		if(diference < 24){
			if(diference === 0){
				let minutes = ((new Date().getTime() - new Date(date).getTime()) / 1000) / 60
				let mins = Math.abs(Math.round(minutes))
				return `${mins} ${mins === 1 ? "minute" : "minutes"} ago`
			}
			return `${diference} ${diference === 1 ? "hour" : "hours"} ago`
		}
		else{
			diference /= 24;
			let days = Math.abs(Math.round(diference))
			if(days < 365){
				return `${days} ${days === 1 ? "day" : "days"} ago`
			}else{
				days /= 365;
				let years = Math.abs(Math.round(days))
				return `${years} ${years === 1 ? "year" : "years"} ago`
			}
		}
	}

  return (
	
	<div className='ad_card-body'>
		<div className='ad_card-info'
			onClick={() => {
				const win = window.open(cardData.story_url, "_blank");
  				win?.focus();
			}}
		>
			<div className='ad_card-info-date'>
				<img src={Clock} alt="clock" />
				<span>{`${getHoursDate(cardData.created_at)} ${cardData.author}`}</span>
			</div>
			<span className='ad_card-info-title'>{cardData.story_title}</span>
		</div>
		<div className='ad_card-favoriteIcon'
			onClick={() => {
				sendFavorite(cardData, isFavorite)
			}}
		>
			<img className='isFavorite' alt='isFavorite' src={isFavorite ? Favorite : NoFavorite}/>
		</div>
	</div>
  )
}

export default CardComponent;