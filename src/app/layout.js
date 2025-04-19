import Script from "next/script";

import "@styles/globals.css";

export const metadata = {
	title: "",
	description: "",
};

export default function layout({ children }) {
	return (
		<html>
			<body className="antialiased">
                {process.env.ACARY_STATS_URL && process.env.ACARY_STATS_ID && (<Script src={process.env.ACARY_STATS_URL} data-website-id={process.env.ACARY_STATS_ID} defer />)}
				
                {children}
			</body>
		</html>
	);
}
	