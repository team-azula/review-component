import React, { Component } from 'react';

const Stats = function(props) {
  let ratings = {};
  let average = 0;
  for (let i = 0; i < props.reviews.length; i++) {
    average += props.reviews[i].rating;
    if (ratings[Math.ceil(props.reviews[i].rating / 2)]) {
      ratings[Math.ceil(props.reviews[i].rating / 2)]++;
    } else {
      ratings[Math.ceil(props.reviews[i].rating / 2)] = 1;
    }
  }
  average /= props.reviews.length;
  average = Math.floor(average * 10) / 10;

  const sizes = [];
  for (let i = 1; i <= 5; i++) {
    const percent = (ratings[i] / props.reviews.length) * 100;
    sizes.push({
      'maxWidth': `${percent * 2 || 4}%`
    });
  }

  const stars = [];
  if (average % 2) {
    let numbStars = Math.floor(average / 2);
    for (let i = 0; i < numbStars; i++) {
      stars.push(<i key={i} className="icon-star"></i>);
    }
    stars.push(<i key="half-empty" className="icon-star-half-empty"></i>);
  } else {
    let numbStars = (average - 1) / 2;
    for (let i = 0; i < numbStars; i++) {
      stars.push(<i key={i} className="icon-star"></i>);
    }
  }
  for (let i = stars.length; i < 5; i++) {
    stars.push(<i key={i} className="icon-star-empty"></i>);
  }

  const bar = {
    textAlign: 'left',
    paddingLeft: '2px',
    paddingTop: '0px',
    paddingBottom: '0px',
    color: 'white'
  };

  return (
    <div className="row" style={{textAlign: 'center', paddingBottom: '25px'}}>
      <div className="col-sm-1"></div>
      <div className="col-sm-3">
        <h1 style={{fontWeight: '100', fontSize: '64px'}}>{(average / 2) || 0}</h1>
        <p style={{padding: '10px 0 5px', fontSize: '20px', letterSpacing: '6px'}}>{stars}</p>
        <p style={{fontWeight: '300', fontSize: '16px', letterSpacing: '1px'}}><i className="icon-user"></i>	&nbsp;{props.reviews.length} total</p>
      </div>
      <div className="col-sm-1"></div>
      <div className="col-sm-6" style={{textAlign: 'left'}}>
        <div style={{marginRight: '10px'}}>
          <div style={{paddingBottom: '5px'}}>
            <div className="bar five" style={Object.assign({maxWidth: sizes[4].maxWidth, backgroundColor: '#57bb8a'}, bar)}>5</div>
          </div>
          <div style={{paddingBottom: '5px'}}>
            <div className="bar four" style={Object.assign({maxWidth: sizes[3].maxWidth, backgroundColor: '#9ace6a'}, bar)}>4</div>
          </div>
          <div style={{paddingBottom: '5px'}}>
            <div className="bar three" style={Object.assign({maxWidth: sizes[2].maxWidth, backgroundColor: '#ffcf02'}, bar)}>3</div>
          </div>
          <div style={{paddingBottom: '5px'}}>
            <div className="bar two" style={Object.assign({maxWidth: sizes[1].maxWidth, backgroundColor: '#ff9f02'}, bar)}>2</div>
          </div>
          <div style={{paddingBottom: '5px'}}>
            <div className="bar one" style={Object.assign({maxWidth: sizes[0].maxWidth, backgroundColor: '#ff6f31'}, bar)}>1</div>
          </div>
        </div>
      </div>
      <div className="col-sm-1"></div>
    </div>
  );
};

export default Stats;