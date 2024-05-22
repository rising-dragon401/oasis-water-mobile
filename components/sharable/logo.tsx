import React from "react";
import Svg, { Circle, G, Path } from "react-native-svg";

type Props = {
	style?: any;
};

export const Logo = ({ style }: Props) => (
	<Svg width="56" height="70" viewBox="0 0 71.58 120" fill="none" style={style}>
		<G>
			<Circle
				fillRule="evenodd"
				clipRule="evenodd"
				fill="none"
				stroke="#2946a0"
				strokeWidth="2"
				cx="35.79"
				cy="29.64"
				r="28.14"
			/>
			<Path
				fillRule="evenodd"
				clipRule="evenodd"
				fill="none"
				stroke="#2946a0"
				strokeWidth="2"
				d="m.5,32.17c0-1.44,8.05,32.24,35.29,32.24,29.04,0,35.29-33.55,35.29-32.2,0,12.45-6.24,40.65-35.14,40.65S.5,47.27.5,32.17Z"
			/>
			<Circle
				fillRule="evenodd"
				clipRule="evenodd"
				fill="#2946a0"
				cx="35.79"
				cy="95.37"
				r="16.87"
			/>
		</G>
	</Svg>
);

export default Logo;
