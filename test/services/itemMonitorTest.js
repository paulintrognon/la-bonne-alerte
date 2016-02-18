"use strict";

describe("itemMonitor Service", function itemMonitorSuite() {
  describe("detectUnseenItems", detectUnseenItemsSuite);
  describe("markItemsAsSeen", markItemsAsSeenSuite);
});

var _ = require("lodash"),
  should = require("should/as-function"),
  itemMonitorFactory = require("../../services/itemMonitor.js");

function detectUnseenItemsSuite() {
  it("should return unseen items and mark new items as seen", unseenItemTest);

  function unseenItemTest() {
    const service = itemMonitorFactory.create(),
      firstBatchOfItems = [
        {id: "1"},
        {id: "2"},
        {id: "3"},
        {id: "4"}
      ],
      secondBatchOfItems = [
        {id: "5"},
        {id: "3"},
        {id: "1"},
        {id: "2"},
        {id: "6"}
      ];
    const firstBatchOfUnseenItems = service.detectUnseenItems(firstBatchOfItems);
    should(firstBatchOfUnseenItems).eql(firstBatchOfItems);

    const secondBatchOfUnseenItems = service.detectUnseenItems(secondBatchOfItems);
    should(secondBatchOfUnseenItems).eql([
      {id: "5"},
      {id: "6"}
    ]);

    const seenItems = service.getSeenItems(),
      expectedSeenItems = _.uniq(_.map(firstBatchOfItems.concat(secondBatchOfItems), "id"));
    should(seenItems).eql(expectedSeenItems);
  }
}

function markItemsAsSeenSuite() {
  it("should mark items as seen", markItemsTest);

  function markItemsTest() {
    const service = itemMonitorFactory.create(),
      items = [
        {id: "1"},
        {id: "2"},
        {id: "3"}
      ];

    service.markItemsAsSeen(items);

    should(service.getSeenItems()).eql(_.map(items, "id"));
  }
}
