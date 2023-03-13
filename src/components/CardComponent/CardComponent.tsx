import React from 'react'
import { Clock, Favorite, NoFavorite } from '../../assets/icons';
import "./style.css";

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

	/*** 
		*getHoursDate: This function shows the "time ago" of each card component
                        (requires:
							- date: The creation date of each news item
						)
						(returns: The time pased ex:(years ago, days ago, hours ago, minutes, ago)
	*/
	const getHoursDate = (date: string) => {
		let dateDiff: number = (new Date().getTime() - new Date(date).getTime()) / 1000;
		dateDiff /= 3600;
		let hours = Math.abs(Math.round(dateDiff))

		if(hours < 24){
			if(hours === 0){
				let minutes = ((new Date().getTime() - new Date(date).getTime()) / 1000) / 60
				let mins = Math.abs(Math.round(minutes))

				return `${mins} ${mins === 1 ? "minute" : "minutes"} ago`
			}
			return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
		}else{
			let days = Math.abs(Math.round(hours / 24))
			if(days < 365){
				return `${days} ${days === 1 ? "day" : "days"} ago`
			}else{
				let years = Math.abs(Math.round(days / 365));
				
				return `${years} ${years === 1 ? "year" : "years"} ago`
			}
		}
	}

	return (
		<div className='ad_card-body'>
			<div 
				className='ad_card-info'
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
			<div
				className='ad_card-favoriteIcon'
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