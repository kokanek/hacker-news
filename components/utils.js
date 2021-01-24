export function getElapsedTime(date) {
  // get total seconds between the times
  var delta = Math.abs(new Date().getTime()/1000 - date);

  // calculate (and subtract) whole days
  var days = Math.floor(delta / 86400);
  if (days) return `${days} days ago`;
  delta -= days * 86400;

  // calculate (and subtract) whole hours
  var hours = Math.floor(delta / 3600) % 24;
  if (hours) return `${hours} hours ago`;
  delta -= hours * 3600;

  // calculate (and subtract) whole minutes
  var minutes = Math.floor(delta / 60) % 60;
  if (minutes) return `${minutes} minutes ago`;
  delta -= minutes * 60;

  // what's left is seconds
  var seconds = delta % 60;
  return `${seconds} seconds ago`;
}

