import React, { Component } from "react";
import $ from "jquery";

class ReviewItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      review: props.review,
      stars: [],
    };
  }

  componentDidMount() {
    const stars = [];
    const review = this.state.review;
    if (review.rating % 2) {
      let numbStars = (review.rating - 1) / 2;
      for (let i = 0; i < numbStars; i++) {
        stars.push(<i key={i} className="icon-star"></i>);
      }
      stars.push(<i key="half-empty" className="icon-star-half-empty"></i>);
    } else {
      let numbStars = (review.rating - 1) / 2;
      for (let i = 0; i < numbStars; i++) {
        stars.push(<i key={i} className="icon-star"></i>);
      }
    }
    for (let i = stars.length; i < 5; i++) {
      stars.push(<i key={i} className="icon-star-empty"></i>);
    }
    this.setState({
      stars,
    });
  }

  handleLikeClick() {
    const review = this.state.review;
    if ($.post) {
      $.post({
        url: `/likes/${review._id}`,
      }).then(() => {
        review.likes++;
        this.setState({
          review,
        });
      });
    }
  }

  render() {
    return (
      <div style={{ padding: "15px 20px 25px" }}>
        <div className="row">
          <div className="col-md-1" style={{ padding: "0 0 0" }}>
            <p
              style={{
                backgroundColor: "lightcoral",
                width: "55px",
                height: "55px",
                borderRadius: "50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "160%",
                fontWeight: "500",
                color: "white",
              }}
            >
              {this.state.review.author[0]}
            </p>
          </div>
          <div className="col-md-11" style={{ padding: "0 0 0 25px" }}>
            <div className="row">
              <div className="col-sm-10 col-md-9">
                <p style={{ fontSize: "125%", fontWeight: "500" }}>
                  {this.state.review.author}
                </p>
                <p style={{ fontSize: "14px", letterSpacing: "2px" }}>
                  {this.state.stars}
                </p>
              </div>
              <p
                className="col-sm-2 col-md-3"
                style={{ fontSize: "120%", fontWeight: "200" }}
              >
                <a onClick={this.handleLikeClick.bind(this)}>
                  <i className="icon-thumbs-up"></i>
                </a>
                : {this.state.review.likes}
              </p>
            </div>
            <p style={{ fontSize: "18px", fontWeight: "300" }}>
              {this.state.review.body}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default ReviewItem;
