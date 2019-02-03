"use strict";

const express = require('express');
const apiRoutes  = express.Router();
const yelpKey = "MC0O35OqLGjWFTBQMqtQX4xLFkHy_qkZhulf-KhNSw3uTHQMhbXEEdPuvDX67hnmhBR_WBR_yg0FkK8PWp-gMKdyXNAw0g7mdjf_HmzonkVOO7lMU-8aJRsBBR5VXHYx";
const yelp = require('yelp-fusion');

const VAN = 'vancouver, bc';
const yelpClient = yelp.client(yelpKey);

function searchYelp(searchString) {
  yelpClient.search({
    term:`${searchString}`,
    location: VAN
    })
    .then(response => {
      console.log(response.jsonBody.businesses.length);
      response.jsonBody.businesses.forEach( (element) => {

        let currentName = element.name.toLowerCase();
        if (currentName.includes(`${searchString.toLowerCase()}`)) {
         console.log(element.name + " matches!");
        } else {
          console.log(element.name + " doesn't match");
        }

      });
    })
    .catch(e => {
    console.log(e);
  });
}

const wiki = require('node-wikipedia');

function searchWikip (searchString) {
  wiki.page.data(searchString, { content: true }, (res) => {

      const wikiInfobox = res.text['*'] // for movies, books
        .replace('<table', 'STRINGSPLITTER')
        .replace('</tbody></table>', 'STRINGSPLITTER')
        .split('STRINGSPLITTER')[1].toLowerCase();

      const wikiFirstPara = res.text['*'] // for food (and other)
        .replace('<p>', 'STRINGSPLITTER \n\n\n')
        .replace('</p><p>', 'STRINGSPLITTER \n\n\n')
        .split('STRINGSPLITTER')[1].toLowerCase();

      const wikiWholeBody = res.text['*'];

      if (bookChecker(wikiInfobox)) {
        return console.log('It\'s a book!');
      }
      if (movieChecker(wikiInfobox)) {
        return console.log('It\'s a movie!');
      }
      if (buyChecker(wikiFirstPara) && !personChecker(wikiInfobox)) {
        return console.log('It\'s a thing to buy.');
      }
      if (buyChecker(wikiWholeBody) && !personChecker(wikiInfobox)) {
        return console.log('It\'s a thing to buy.');
      }
      if (personChecker(wikiInfobox)) {
        return console.log('It\'s a person.');
      }
      return console.log('to be categorized');
  });

}

// HELPERS
function bookChecker (wikiString) {
  return wikiString.includes('publisher');
}
function movieChecker (wikiString) {
  return wikiString.toLowerCase().includes('starring');
}
function buyChecker (wikiString) {
  const termsArr = ['edible', 'furniture', 'garment', 'patent'];
  for (const term of termsArr) {
    if (wikiString.includes(term)) {
      return true;
    }
  }
  return false;
}
function personChecker (wikiString) {
  return wikiString.includes('born');
}

module.exports = () => {

  apiRoutes.get('/:search', (request, response) => {
    let searchTerm = request.params.search;
    searchTerm = searchTerm.replace("to-do=", "");
    // console.log(searchTerm);
    searchWikip(searchTerm);
    // searchYelp(searchTerm);
    response.send(200);
  });

  return apiRoutes;
}
