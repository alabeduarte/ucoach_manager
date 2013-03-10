describe("PlayerBuilder", function() {
  var playerBuilder;
  var draggingDropHandler;
  var draggingDropSpy;
  var server;

  beforeEach(function() {
    loadFixtures('newFormation.html');
    server = sinon.fakeServer.create();
    server.respondWith("GET", "/bahia_squad.json",
      [200, { "Content-Type": "application/json" },
      '[{ "player": { "id":"playerId","name":"Souza","number":9, "position_mapper":{"code":"AC"} } }]'
      ]);

    draggingDropHandler = new DraggingDropHandler({});
    playerBuilder = new PlayerBuilder(draggingDropHandler);
  });

  afterEach(function() {
    server.restore();
  });

  describe("Finding players", function() {
    var ajaxSpy = sinon.spy($, "getJSON");
    var all;

    beforeEach(function() {
      all = playerBuilder.findAll();
      server.respond();
    });
    it("should call for JSON services", function() {
      expect(ajaxSpy).toHaveBeenCalled();
      expect(ajaxSpy.getCall(0).args[0]).toEqual('/bahia_squad.json');
    });
    describe("when request is successfull", function() {
      it("should fetch all data of players", function() {
        expect(all.length).toEqual(1);
      });
      it("should match player fields", function() {
        var player = all[0];
        expect(player.id).toEqual("playerId");
        expect(player.name).toEqual("Souza");
        expect(player.number).toEqual(9);
        expect(player.positionCode).toEqual("AC");
      });
    });
  });

  describe("Preparing Players", function() {
    var players;
    beforeEach(function() {
      players = [
      new Player({id: "playerId1", name: "Lomba", number: "1", position_mapper: {code: "G"}, enabled: true}),
      new Player({id: "playerId2", name: "Neto", number: "2", position_mapper: {code: "DD"}, enabled: true}),
      new Player({id: "playerId3", avatar: "avatar3", name: "Fahel", number: "7", position_mapper: {code: "MDC"}, enabled: true}),
      new Player({id: "disabled", avatar: "none", name: "Disabled", number: "0", position_mapper: {code: "G"}, enabled: false})
      ];
    });

    describe("Appending to position div", function() {
      beforeEach(function() {
        playerBuilder.create(players);
      });
      it("should create div for player inside in his position mapper", function() {
        expect($("#right_back")).toContain($('#playerId2'));
      });
      it("should add .goal_keeper css class for goalkeeper", function() {
        expect($("#playerId1")).toHaveClass("goal_keeper");
      });
      it("should add .team css class for anothers", function() {
        expect($("#playerId3")).toHaveClass("team");
      });
    });
    describe("Adding popover", function() {
      beforeEach(function() {
        playerBuilder.create(players);
      });
      it("should have blank space before popover", function() {
        expect($('#playerId3').html()).toContain('<p>&nbsp;</p>');
      });
      it("should have popover with name", function() {
        expect($('#playerId3')).toContain($('#popover_playerId3'));
      });
      it("should have .popover css class", function() {
        expect($('#popover_playerId3')).toHaveClass("popover");
      })
      it("should have contain img source", function() {
        expect($('#popover_playerId3')).toContain($('#avatar_playerId3'));
        expect($('#avatar_playerId3').attr('src')).toEqual('/assets/bahia_squad/avatar3');
        expect($('#avatar_playerId3').attr('width')).toEqual('75px');
        expect($('#avatar_playerId3').attr('height')).toEqual('105px');
      });
      it("should have player number", function() {
        expect($('#popover_playerId3').html()).toContain('<span class="number">7</span>');
      });
      it("should have player name", function() {
        expect($('#playerId3').html()).toContain('Fahel');
      });
    });

    describe("Enabling/Disabling players", function() {
      var draggingDropSpy;
      beforeEach(function() {
        draggingDropSpy = sinon.spy(draggingDropHandler, "handle");
        playerBuilder.create(players);
      });

      describe("when player is enabled", function() {
        it("should call draggingDropHandler", function() {
          expect(draggingDropSpy).toHaveBeenCalledWith(players[0]);
        });
        it("should have .enabled css class", function() {
          expect($("#playerId1")).toHaveClass("enabled");
        });
        it("should have .player css class", function() {
          expect($("#playerId1")).toHaveClass("player");
        });
        it("should show popover on mouse over", function() {
          $("#playerId1").trigger("mouseover");
          expect($("#popover_playerId1").css('display')).toEqual("block");
        });
        it("should show popover on mouse over", function() {
          $("#playerId1").trigger("mouseout");
          expect($("#popover_playerId1").css('display')).toEqual("none");
        });
      });
      describe("when player is disabled", function() {
        it("should call draggingDropHandler", function() {
          expect(draggingDropSpy).not.toHaveBeenCalledWith(players[3]);
        });
        it("should have .disabled css class", function() {
          expect($("#disabled")).toHaveClass("disabled");
        });
        it("should not have .player css class", function() {
          expect($("#disabled")).not.toHaveClass("player");
        });
        it("should not have popover", function() {
          expect($('#disabled')).not.toContain($('#popover_disabled'));
        });
      });
    });

  });

});
