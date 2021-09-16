'use strict';

const fs       = require('fs');
const path     = require('path');

class Verse {

  constructor(str) {
    this.str = str;

    let strbible = fs.readFileSync(__dirname+"/baiboly.json", 'utf8');
    let anarBoky = fs.readFileSync(__dirname+"/mapBoky.json", 'utf8');
    
    this.baiboly = JSON.parse(strbible);
    this.boky    = JSON.parse(anarBoky);
  }

  range(start, stop, step) {
    return Array.from({ length: (stop - start) / step + 1}, (_, i) => start + (i * step));
  }

  reads(str) {
    if (/^\d+$/.test(str))
      return [+str]

    let arr = str.split(/\,/).map( m => {
      if (/\-/.test(m)){
        let split = m.split(/\-/);
        return this.range(+split[0], +split[1], 1)
      }
      return +m
    } );
    return this.deplace(arr);
  }

  allBooks() {

    let strings = "";
    let kyes = Object.keys(this.boky)
    for(let key of kyes) {

      strings += this.boky[key].name + " ".repeat(25-this.boky[key].name.length) +  key.toUpperCase() + "\n"
    }

    strings += "\nUsage : /path/to/baiboly --teny <text to load>\n";
    strings += "Examples:  baiboly --teny gen 5\n";
    strings += "Jaona 3:16 baiboly --teny joh 3:16\n";
    return strings
  }

  deplace(arr) {
    let nwa = []
    for(let a of arr) {
      if (Array.isArray(a)) {
        nwa = [...nwa, ...a]
      } else {
        nwa.push(a)
      }
    }
    return nwa
  }

  subGet(str) {
    let name = str.match(/\d*[a-z\.]+\d*/i)
    name = this.str.match(/\d*[a-z\.]+\d*/i);
    let chapter = str.match(/\d+/)
    let split = str.split(/\:/ )
    let books = []
    let texts = ""

    let textsArray = this.baiboly.body[ 
      this.boky[name[0].toUpperCase()].order
    ].books[chapter-1].texts;

    if (split.length && split.length >= 2) {
      split = split[1]
      books = this.reads(split)

      for(let i = 0; i < books.length && books[i]-1 < textsArray.length ; i++) {
        texts += books[i] + ". " + textsArray[books[i]-1] + " "
      }

    } else {
      books = this.range(1, 500, 1);

      for(let i = 0 ; i < textsArray.length; i++) {
        texts += (i+1)+ ". " + textsArray[i] + " "
      }
    }


    return {
      name: name[0],
      chapter: +chapter[0],
      //books,
      texts,
      book: `${name[0]} ${str.replace(name[0], '')}`
    }
  }

  get() {
    const nwp = []
    let map = this.str.split(/\|/)
    for(let str of map) {
      nwp.push(this.subGet(str))
    }
    return nwp;
  }

  books() {
    let obj = {}
    let gets = this.get();
    let index = 0;
    let texts = "";
    for(let verse of gets) {
      texts += verse.book.toUpperCase() + "\n" + verse.texts
    }
    return texts
  }

  change(str) {
    this.str = str
  }
}

module.exports = { Verse }
/*
const verse = new Verse('Ex. 1:1-20')
console.log(verse.books());
verse.change('Marc. 2:25,27-30')
console.log(verse.books());
verse.change('Job. 2')
console.log(verse.books());
verse.change('Jacob 5:1-10|6:1,9')
console.log(verse.books());

verse.change('Jacob 5:1-10|Mat. 3:4-10')
console.log(verse.books());
verse.change('Jacob 5:1-10|Mat. 3:4-10|4:10-15')
console.log(verse.books());
*/