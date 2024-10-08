const updateStarsCount = () => {

  fetch("https://api.github.com/repos/kivy/kivy")
    .then(res => res.json())
    .then(data => {
      document.getElementById("stars-count").innerHTML = `${(data.stargazers_count / 1000).toFixed(1)}K Stars`;
    });

  };

updateStarsCount();
