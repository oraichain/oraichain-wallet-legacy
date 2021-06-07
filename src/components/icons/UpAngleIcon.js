import React from "react";
import PropTypes from "prop-types";

const UpAngleIcon = ({ className }) => {
	return (
		<svg className={className} width="8" height="5" viewBox="0 0 8 5" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path fill-rule="evenodd" clip-rule="evenodd" d="M0.306023 3.23222C-0.102008 3.63661 -0.102008 4.29227 0.306023 4.69667C0.714053 5.10107 1.3756 5.10107 1.78363 4.69667L3.99993 2.5001L6.21625 4.69669C6.62428 5.10109 7.28583 5.10109 7.69386 4.69669C8.10189 4.29229 8.10189 3.63663 7.69386 3.23223L4.75168 0.316238C4.74745 0.311897 4.74317 0.307584 4.73885 0.303299C4.51967 0.0860662 4.22733 -0.0144746 3.94043 0.00167661C3.69317 0.0155472 3.44993 0.116092 3.26103 0.303311C3.25695 0.307357 3.25291 0.311427 3.24891 0.315523L0.306023 3.23222Z" fill='currentColor' />
		</svg>
	);
};

UpAngleIcon.propTypes = {
	className: PropTypes.string,
};

UpAngleIcon.defaultProps = {
	className: "",
};

export default UpAngleIcon;
