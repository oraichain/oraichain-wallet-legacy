import { connect } from "react-redux";
import { useLocation } from "react-router-dom";
import _ from "lodash";
import { selectUser } from "src/store/slices/userSlice";
import { Redirect, Route } from "react-router";
import { pagePaths } from "src/consts/pagePaths";

const mapStateToProps = (state) => {
    const user = selectUser(state);
    const isLoggedIn = !_.isNil(user);
    return {
        isLoggedIn: isLoggedIn,
    };
};

const UnauthenticatedRoute = ({ component: Component, isLoggedIn, ...rest }) => {
    const location = useLocation();
    if (isLoggedIn) {
        return <Redirect to={{ pathname: pagePaths.HOME, search: location.search, state: { from: location } }} />;
    }

    return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default connect(mapStateToProps, null)(UnauthenticatedRoute);
