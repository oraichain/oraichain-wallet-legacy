import React from "react";
import PropTypes from "prop-types";

const DownAngleIcon = ({ className }) => {
	return (
		<svg className={className} width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path fill-rule="evenodd" clip-rule="evenodd" d="M7.69398 1.76778C8.10201 1.36339 8.10201 0.707726 7.69398 0.303327C7.28595 -0.101072 6.6244 -0.101072 6.21637 0.303327L4.00007 2.4999L1.78375 0.303314C1.37572 -0.101085 0.714172 -0.101085 0.306142 0.303314C-0.10189 0.707713 -0.101889 1.36337 0.306142 1.76777L3.24832 4.68376C3.25255 4.6881 3.25683 4.69242 3.26115 4.6967C3.48033 4.91393 3.77267 5.01447 4.05957 4.99832C4.30683 4.98445 4.55007 4.88391 4.73897 4.69669C4.74305 4.69264 4.74709 4.68857 4.75109 4.68448L7.69398 1.76778Z" fill='currentColor' />
		</svg>
	);
};

DownAngleIcon.propTypes = {
	className: PropTypes.string,
};

DownAngleIcon.defaultProps = {
	className: "",
};

export default DownAngleIcon;
