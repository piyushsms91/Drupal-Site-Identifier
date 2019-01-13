var fs = require('fs');
//var phantomcss = require('phantomcss');

var casper = require("casper").create()
  , url = casper.cli.get(0)
  , metas = [];

if (!url) {
    casper.echo('Usage: casperjs [url]').exit();
}

casper.on('remote.message', function(msg) {
    console.log(msg);
});

casper.start(url, function() {
    metas = this.evaluate(function() {
        var metas = [];
        var garden = [];
        var i=0;
        var j=0;
        var myIndex = null;
        
        // is site Drupal 7 or Drupal 8
        [].forEach.call(document.querySelectorAll('meta'), function(elem) {
            var meta = {};
            [].slice.call(elem.attributes).forEach(function(attr) {
                if(attr.value == 'generator'||attr.value == 'Generator'){
                    myIndex = i;
                }
                meta[attr.name] = attr.value;
                j++
            });
            metas.push(meta);
            i++;
        });
        return metas[myIndex].content;      
    });
    
    garden = this.evaluate(function() {
        var garden = [];
        var isGarden = false;
        [].forEach.call(document.querySelectorAll('link'), function(elem) {
            var meta = {};
            [].slice.call(elem.attributes).forEach(function(attr) {
                meta[attr.name] = attr.value;
            });
            if(~meta.href.indexOf('sites\/g\/files')){
                garden.push('matched');
                isGarden = true;
            }
            else{
                garden.push('not matched');
            }
        });
        return isGarden;
    }); 
});

casper.run(function() {
    if(garden==true){
        casper.echo('\n Site is in Drupal Garden \n');
    }else{
        if(metas!=null){
            metas=(metas.indexOf('7')>0) ? 'Drupal 7' : 'Drupal 8';
            casper.echo('\n Site is in ' + metas + '\n');
        }
        else{
            casper.echo('\n Site is in Edison Lit \n'); 
        }
    }
    this.exit();  
});
