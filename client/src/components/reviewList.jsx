import React, { Component } from 'react';
import ReviewItem from './reviewItem.jsx';

const ReviewList = function(props) {

  const reviews = props.reviews.map((review) => {
    return <ReviewItem key={review._id} review={review}/>;
  });

  if (!reviews.length) {
    reviews.push(
      <p key="empty" style={{padding: '30px 0', textAlign: 'center', fontSize: '160%'}}>Sorry, It doesn't seem like there are any reviews.</p>
    );
  }

  return (
    <div style={{backgroundColor: 'white', padding: '10px 40px 0 45px'}}>
      {reviews}
    </div>
  );
};

export default ReviewList;