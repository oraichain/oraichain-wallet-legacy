import React from "react";
import PropTypes from "prop-types";

const QuestionIcon = ({ className }) => {
	return (
		<svg className={className} width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path d="M9.0009 0C4.0315 0 0 4.02602 0 8.99527C0 13.9693 4.0315 18 9.00086 18C13.973 18 18.001 13.9692 18.001 8.99527C18.0011 4.02602 13.973 0 9.0009 0ZM9.6423 14.0031C9.43325 14.1891 9.19098 14.2826 8.91653 14.2826C8.63257 14.2826 8.38488 14.1908 8.17346 14.0068C7.9617 13.8232 7.85561 13.5661 7.85561 13.2357C7.85561 12.9426 7.95828 12.696 8.16295 12.4961C8.36763 12.2962 8.61869 12.1962 8.91653 12.1962C9.20961 12.1962 9.4563 12.2962 9.65656 12.4961C9.85648 12.696 9.95677 12.9426 9.95677 13.2357C9.9564 13.5613 9.85168 13.8171 9.6423 14.0031ZM12.249 7.54145C12.0884 7.83926 11.8976 8.09605 11.6763 8.31258C11.4558 8.52907 11.059 8.89294 10.4863 9.40453C10.3284 9.54887 10.2014 9.67558 10.1062 9.78466C10.011 9.89411 9.93981 9.99402 9.89337 10.0848C9.8466 10.1756 9.81071 10.2664 9.78528 10.3572C9.75985 10.4477 9.72159 10.6073 9.66973 10.8353C9.58165 11.3191 9.30482 11.561 8.83958 11.561C8.59764 11.561 8.39435 11.482 8.22865 11.3238C8.06362 11.1656 7.98129 10.9308 7.98129 10.6191C7.98129 10.2285 8.04194 9.88999 8.16291 9.60372C8.28321 9.31742 8.44416 9.06638 8.64408 8.84989C8.84433 8.6334 9.11403 8.37656 9.45389 8.07875C9.75172 7.81821 9.9669 7.62172 10.0994 7.48922C10.2322 7.35643 10.3437 7.20871 10.4341 7.04607C10.5253 6.8831 10.57 6.70658 10.57 6.51585C10.57 6.14352 10.4321 5.82979 10.155 5.574C9.87815 5.3182 9.521 5.19012 9.08356 5.19012C8.57159 5.19012 8.1948 5.3192 7.95286 5.57737C7.71092 5.83554 7.50663 6.21567 7.33889 6.71813C7.18032 7.24397 6.88011 7.50685 6.43858 7.50685C6.17801 7.50685 5.95812 7.41503 5.77888 7.23139C5.59997 7.04774 5.51051 6.84888 5.51051 6.63477C5.51051 6.19295 5.65249 5.74505 5.93611 5.2914C6.22007 4.83775 6.63412 4.462 7.17861 4.16452C7.72276 3.86671 8.35812 3.71762 9.08356 3.71762C9.75819 3.71762 10.3535 3.84229 10.8699 4.09133C11.3863 4.34 11.7854 4.67849 12.067 5.10671C12.3483 5.53461 12.4892 5.99981 12.4892 6.50227C12.4899 6.89702 12.4096 7.24364 12.249 7.54145Z" fill="#9A9A9A" />
		</svg>
	);
};

QuestionIcon.propTypes = {
	className: PropTypes.string,
};

QuestionIcon.defaultProps = {
	className: "",
};

export default QuestionIcon;