var $newMonsterForm = $('.new-monster-form');
var $newMonsterName = $('.new-monster-form--name');
var $newMonsterSubmit = $('.new-monster-form--submit');

var $monsterList = $('.monster-list');

$newMonsterForm.on('submit', function (event) {
  event.preventDefault();
  var name = $newMonsterName.val();

  Monstertorium.add(name);

  $newMonsterName.val('');
});

$monsterList.on('click', '.monster-levelup', function () {
  var id = $(this).parents('.monster-list-item').attr('id');
  Monstertorium.find(id).levelUp();
});

$monsterList.on('click', '.monster-leveldown', function () {
  var id = $(this).parents('.monster-list-item').attr('id');
  Monstertorium.find(id).levelDown();
});

$monsterList.on('click', '.monster-delete', function () {
  var id = $(this).parents('.monster-list-item').attr('id');
  Monstertorium.find(id).remove();
});

var Monstertorium = {
  monsters: [],
  add: function (name) {
    this.monsters.push(new Monster(name));
    this.store();
  },
  remove: function (id) {
    id = parseInt(id);
    this.monsters = this.monsters.filter(function (m) {
      return m.id !== id;
    });
    this.store();
  },
  find: function (id) {
    id = parseInt(id);
    return this.monsters.find(function (m) {
      return m.id === id;
    });
  },
  render: function () {
    $monsterList.html(this.monsters.map(function (monster) {
      return monster.toHTML();
    }));
  },
  store: function () {
    localStorage.setItem('monsters', JSON.stringify(this.monsters));
    this.render();
  },
  retrieve: function () {
    var retrievedMonsters = JSON.parse(localStorage.getItem('monsters'));
    if (retrievedMonsters) {
      this.monsters = retrievedMonsters.map(function (m) {
        return new Monster(m.name, m.id, m.level);
      });
    }
  }
};

function Monster(name, id = Date.now(), level = 1) {
  this.name = name;
  this.id = id;
  this.level = level;
}

Monster.prototype.levelUp = function () {
  this.level++;
  Monstertorium.store();
};

Monster.prototype.levelDown = function () {
  if (this.level > 1) {
    this.level--;
    Monstertorium.store();
  }
};

Monster.prototype.remove = function () {
  Monstertorium.remove(this.id);
};

Monster.prototype.toHTML = function () {
  return (`
    <article class="monster-list-item" id="${this.id}">
      <h2>${this.name}</h2>
      <p class="monster-level">Level <span class="monster-level-number">${this.level}</span></p>
      <img src="https://www.gravatar.com/avatar/${md5(this.id)}?d=monsterid&s=200">
      <div class="monster-controls">
        <button class="monster-levelup">Level Up</button>
        <button class="monster-leveldown">Level Down</button>
        <button class="monster-delete">Delete</button>
      </div>
    </article>
  `);
};

Monstertorium.retrieve();
Monstertorium.render();
