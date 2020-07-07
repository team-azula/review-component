import React from 'react';
import { shallow, mount, render } from 'enzyme';

import Review from '../client/src/components/app.jsx';
import Stats from '../client/src/components/stats.jsx';
import ReviewList from '../client/src/components/reviewList.jsx';
import ReviewItem from '../client/src/components/reviewItem.jsx';

describe('Review', () => {
  test('renders review list', () => {
    const wrapper = shallow(<Review />);
    expect(wrapper.find(ReviewList).length).toEqual(1);
  });

  test('renders stats item', () => {
    const wrapper = shallow(<Review />);
    expect(wrapper.find(Stats).length).toEqual(1);
  });

  test('creates an input', () => {
    const wrapper = shallow(<Review />);
    expect(wrapper.find('select').length).toEqual(1);
  });

  test('review list has some list items', () => {
    const testReview = [{
      author: 'Tester',
      body: 'I\'m baby',
      item: 6,
      rating: 5,
      likes: 25,
      _id: 'tentacle'
    }];
    // Renders when no reviews
    const empty = shallow(<ReviewList reviews={[]}/>);
    expect(empty.find(ReviewItem).length).toBe(0);
    // Renders when reviews exist
    const filled = shallow(<ReviewList reviews={testReview}/>);
    expect(filled.find(ReviewItem).length).toBe(1);
  });

  test('review list item is rendered', () => {
    const testReview = [{
      author: 'Tester',
      body: 'I\'m baby',
      item: 6,
      rating: 5,
      likes: 25,
      _id: 'tentacle'
    },
    { author: 'Tester also',
      body: 'I\'m baby',
      item: 5,
      rating: 8,
      likes: 27,
      _id: 'eleventacle'
    }];
    // Renders half stars
    const half = shallow(<ReviewItem key={testReview[0]._id} review={testReview[0]}/>);
    expect(half).toMatchSnapshot();
    // Renders full stars
    const full = shallow(<ReviewItem key={testReview[1]._id} review={testReview[1]}/>);
    expect(full).toMatchSnapshot();
  });

  test('statistics component', () => {
    const testCases = [
      [{rating: 10}, {rating: 5}],
      []
    ];
    // Renders with no ratings
    const empty = shallow(<Stats key={0} reviews={testCases[1]}/>);
    expect(empty).toMatchSnapshot();
    // Renders with ratings
    const full = shallow(<Stats key={1} reviews={testCases[0]}/>);
    expect(full).toMatchSnapshot();
  });
});