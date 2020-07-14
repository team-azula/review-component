import React, { Component } from "react";
import Stats from "./stats.jsx";
import ReviewList from "./reviewList.jsx";
import $ from "jquery";

class Review extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reviews: [],
      original: [],
      id: props.id,
    };
  }

  componentDidMount() {
    console.log(this.state.id);
    if ($.get) {
      $.get({
        url: `http://ec2-3-128-24-213.us-east-2.compute.amazonaws.com:3002/reviews/${this.state.id}`,
      }).then((reviews) => {
        this.setState({
          reviews: reviews,
          original: reviews,
        });
      });
    }
  }

  handleSelectChange(e) {
    let reviews = this.state.original.slice();
    switch (e.target.value) {
      case "recent":
        this.setState({
          reviews,
        });
        break;
      case "liked":
        reviews.sort((a, b) => b.likes - a.likes);
        this.setState({
          reviews,
        });
        break;
      case "positive":
        reviews.sort((a, b) => b.rating - a.rating);
        this.setState({
          reviews,
        });
        break;
      case "critical":
        reviews.sort((a, b) => a.rating - b.rating);
        this.setState({
          reviews,
        });
        break;
    }
  }

  render() {
    return (
      <div
        className="container"
        style={{
          backgroundColor: "white",
          color: "rgb(90, 90, 90)",
          width: "720px",
        }}
      >
        <div
          className="row"
          style={{
            padding: "30px 25px 20px 25px",
            fontSize: "16px",
            fontWeight: "400",
          }}
        >
          <p className="col-sm-8">REVIEWS</p>
          <select
            className="col-sm-4"
            onChange={this.handleSelectChange.bind(this)}
            id="sort"
            name="sort"
          >
            <option value="recent">Most Recent</option>
            <option value="liked">Most Helpful</option>
            <option value="positive">Most Positive</option>
            <option value="critical">Most Critical</option>
          </select>
        </div>
        <Stats reviews={this.state.reviews} />
        <ReviewList reviews={this.state.reviews} />
      </div>
    );
  }
}

export default Review;
