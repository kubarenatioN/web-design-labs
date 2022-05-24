import './SpeechButton.css'
import { MdVolumeDown } from "react-icons/md";

export const SpeechButton = ({speech}) => {

	return (
		<>
			<MdVolumeDown onClick={speech} className="icon" />
		</>
	)
}