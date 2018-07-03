function add(a, b) {
  return a + b;
}

// class Message {
//   constructor(options) {
//     this.to = (options && options.to) || 'test@example.com';
//     this.from = (options && options.from) || 'test@example.com';
//     this.subject = (options && options.subject) || 'Subject';
//     this.text = (options && options.text) || 'Message text';
//   }

//   contents() {
//     return {
//       to: this.to,
//       from: this.from,
//       subject: this.subject,
//       text: this.text,
//     };
//   }
// }


module.exports = {
  add,
};
