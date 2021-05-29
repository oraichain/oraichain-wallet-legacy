import { connect } from "react-redux";
import _ from "lodash";
import { selectUser } from "src/store/slices/userSlice";
import { Redirect, Route } from "react-router";
import { pagePaths } from "src/consts/pagePaths";

const mapStateToProps = (state) => {
    const user = selectUser(state);
    const isLoggedIn = !_.isNil(user);
    return {
        isLoggedIn: isLoggedIn
    };
};

const UnauthenticatedRoute = ({ component: Component, isLoggedIn, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) =>
                isLoggedIn ? (
                    <Redirect to={{ pathname: pagePaths.HOME, state: { from: props.location } }} />

                ) : (
                    <Component {...props} />
                )
            }
        />
    );
};

export default connect(mapStateToProps, null)(UnauthenticatedRoute);
