'use strict';


/**
 * Итератор по друзьям
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 */
function Iterator(friends, filter) {
    Object.setPrototypeOf(this, {
        currentIndex: 0,
        listOfGuests: [],
        next() {
            return this.done() ? null : this.listOfGuests[this.currentIndex++];
        },
        done() {
            return this.currentIndex >= this.listOfGuests.length;
        }
    });
    if (filter instanceof Filter) {
        this.listOfGuests = chooseFriends(friends).filter(friend => filter.isAppropriate(friend));
        this.currentIndex = 0;
    } else {
        throw new TypeError();
    }
}

/**
 * Итератор по друзям с ограничением по кругу
 * @extends Iterator
 * @constructor
 * @param {Object[]} friends
 * @param {Filter} filter
 * @param {Number} maxLevel – максимальный круг друзей
 */
function LimitedIterator(friends, filter, maxLevel) {
    Object.setPrototypeOf(LimitedIterator.prototype, Iterator.prototype);
    Iterator.call(this, friends, filter);
    this.listOfGuests = chooseFriends(friends, maxLevel)
        .filter(friend => filter.isAppropriate(friend));
}

function chooseFriends(friends, maxLevel = friends.length + 1) {
    var selection = [];
    var currentLevel = 1;
    var currentLevelFriends = friends.filter(friend => friend.best);

    while (currentLevelFriends.length > 0 && currentLevel <= maxLevel) {
        selection.push(...currentLevelFriends
            .sort((first, second) => first.name.localeCompare(second.name))
        );

        currentLevelFriends = currentLevelFriends
            .reduce((acc, friend) => acc.concat(friend.friends), [])
            .map(name => friends.find(friend => friend.name === name))
            .filter(function (friend, index, arr) {
                return !selection.includes(friend) && arr.indexOf(friend) === index;
            });
        currentLevel++;
    }

    return selection;
}

/**
 * Фильтр друзей
 * @constructor
 */
function Filter() {
    Object.defineProperty(this, 'isAppropriate', {
        value: function () {

            return true;
        },
        writable: true
    });

    return this;
}

/**
 * Фильтр друзей
 * @extends Filter
 * @constructor
 */
function MaleFilter() {

    Object.setPrototypeOf(this, new Filter());
    Object.defineProperty(this, 'isAppropriate', {
        value: function (a) {
            return a.gender === 'male';
        }
    });


    return this;
}

/**
 * Фильтр друзей-девушек
 * @extends Filter
 * @constructor
 */
function FemaleFilter() {
    Object.setPrototypeOf(this, new Filter());
    Object.defineProperty(this, 'isAppropriate', {
        value: function (a) {
            return a.gender === 'female';
        }
    });

    return this;
}

exports.Iterator = Iterator;
exports.LimitedIterator = LimitedIterator;

exports.Filter = Filter;
exports.MaleFilter = MaleFilter;
exports.FemaleFilter = FemaleFilter;
