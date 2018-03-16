# Performance matters

## Project setup

This project serves an adapted version of the [Bootstrap documentation website](http://getbootstrap.com/). It is based on the [github pages branche of Bootstrap](https://github.com/twbs/bootstrap/tree/gh-pages).

Differences from actual Bootstrap documentation:

- Added custom webfont
- Removed third party scripts
- The src directory is served with [Express](https://expressjs.com/).
- Templating is done with [Nunjucks](https://mozilla.github.io/nunjucks/)

## Getting started

- Install dependencies: `npm install`
- Serve: `npm start`
- Expose localhost: `npm run expose`

### HTTP/2 Server Push

**The plan**
When talkin with Declan this week he mentiont HTTP/2 Server push and the solution/problem this brought with it. To try
and challenge myself I desided to tackel this problem. This meant I needed to get HTTP/2 running on my localhost server
(which meant i needed HTTPS and a certificate aswell).

**Starting**
Lookin at the [Performance masterclass 2017] [the Voorhoede] provides as an example. This helpt to see how I could get HTTP/2 up and running with my node server. To get a better understandin of server push I also read [A Comprehensive Guide To HTTP/2 Server Push] and looked at [Creating a Cache-aware HTTP/2 Server Push Mechanism].

**The problem**
When talkin to Declan he described a problem with server push in that you can't cache it. When the user visits the site for a second time and, for example, your `style.css` is already in the cache your server will still send `style.css` to the browser.

Now when reading the articles mentioned above they also did mention this. However they als came with a solution for this
problem. Not one that is 100% fool proof but compared to anything else still a great improvement. The solution is a
cookie. Once you know the files are in the cache you can store this information in a cookie so that your server knows
what to send and what not to. Now you can say that this can bring problems for people that have cookies disabled and this is true. But for the people that have cookies disabled the site still works, they just wont have a faster experience.

**What I did**
The first step for this was to get HTTP/2 to work in node. I Started off looking at how [the Voorhoede] got HTTP/2 to work in there [Performance masterclass 2017]. In the repo they had the certificate they used for the project and how they set up the different servers which I copied to my own files. Now the first problem occurred. A self signed certificate is rejected as it is seen as unsecure. You can tell your browser to  ignore this for now and proceed so this isn't the biggest thing. But now comes the big problem. To have HTTP/2 on a node.js you need the most up to date version of node. As of writing this this version is `9.8.0`. So this functionality is rather new. And with this come problem.

![Error][Error]

As of now people are still working on a solution for this.

[Node http2 - cannot read this.socket.readable]
[Initial support proposal for http2]

So as of now I am still strugelling with this problem. Because of this I can't run node with HTTP/2 locally so my only
option is to run it live. Get a certificate and make it work here. The link this will be available on is (at the time of
writing this is not yet live) [performance.maddev.nl].

[Performance masterclass 2017]: https://github.com/voorhoede/performance-masterclass-2017-10/blob/master/server.js
[the Voorhoede]: https://www.voorhoede.nl/
[A Comprehensive Guide To HTTP/2 Server Push]: https://www.smashingmagazine.com/2017/04/guide-http2-server-push/
[Creating a Cache-aware HTTP/2 Server Push Mechanism]: https://css-tricks.com/cache-aware-server-push/
[Error]: ./images/this.socket.readable.png "Error"
[Node http2 - cannot read this.socket.readable]: https://github.com/expressjs/express/issues/3388
[Initial support proposal for http2]: https://github.com/expressjs/express/pull/3390
[performance.maddev.nl]: performance.maddev.nl
