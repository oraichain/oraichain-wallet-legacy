import React from "react";
import cn from "classnames/bind";
import PropTypes from "prop-types";
import styles from "./Home.module.scss";
import Test from "src/components/Home/Test";

const cx = cn.bind(styles);

const Home = () => {
  return (
    <div className={cx("home")}>
      <Test></Test>
    </div>
  );
};

Home.propTypes = {};
Home.defaultProps = {};

export default Home;
