import React from "react";
import PropTypes from "prop-types";

const ChartIcon = ({ className }) => {
	return (
		<svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path opacity="0.4" d="M14.6756 0H5.33333C1.92889 0 0 1.92889 0 5.33333V14.6667C0 18.0711 1.92889 20 5.33333 20H14.6756C18.08 20 20 18.0711 20 14.6667V5.33333C20 1.92889 18.08 0 14.6756 0Z" fill="white" fill-opacity="0.7" />
			<path d="M5.36866 7.36902C4.91533 7.36902 4.54199 7.74235 4.54199 8.20457V15.0757C4.54199 15.529 4.91533 15.9024 5.36866 15.9024C5.83088 15.9024 6.20421 15.529 6.20421 15.0757V8.20457C6.20421 7.74235 5.83088 7.36902 5.36866 7.36902Z" fill="white" fill-opacity="0.7" />
			<path d="M10.0354 4.08899C9.58207 4.08899 9.20874 4.46232 9.20874 4.92454V15.0757C9.20874 15.529 9.58207 15.9023 10.0354 15.9023C10.4976 15.9023 10.871 15.529 10.871 15.0757V4.92454C10.871 4.46232 10.4976 4.08899 10.0354 4.08899Z" fill="white" fill-opacity="0.7" />
			<path d="M14.6399 10.9956C14.1777 10.9956 13.8043 11.3689 13.8043 11.8312V15.0756C13.8043 15.5289 14.1777 15.9023 14.631 15.9023C15.0932 15.9023 15.4665 15.5289 15.4665 15.0756V11.8312C15.4665 11.3689 15.0932 10.9956 14.6399 10.9956Z" fill="white" fill-opacity="0.7" />
		</svg>
	);
};

ChartIcon.propTypes = {
	className: PropTypes.string,
};

ChartIcon.defaultProps = {
	className: "",
};

export default ChartIcon;
