$(":radio")
  .change(() => {
    let names = {};
    let values = {};

    $(":radio").each(({}, e) => {
      e = $(e);
      names[e.attr("name")] = true;
      if (e.is(":checked")) values[e.val()] = ~~values[e.val()] + 1;
    });

    let count = 0;
    $.each(names, () => {
      count++;
    });

    if ($(":radio:checked").length === count) {
      $("#submit").prop("disabled", false);
      $("#submit").text("Submit");
      $("#submit").click(() => {
        let bad = values.I || 0 + values.D || 0 + values.F || 0;
        $("#bad-events > td:nth-child(1)").text(bad);
        $("#bad-events > td:nth-child(3)").text(
          bad <= 6
            ? "You are optimistic when bad things happen."
            : bad == 7
            ? "You are average."
            : "You are pessimistic when bad things happen."
        );

        let good = values.H || 0 + values.E || 0 + values.B || 0;
        $("#good-events > td:nth-child(1)").text(good);
        $("#good-events > td:nth-child(3)").text(
          good >= 10
            ? "You are optimistic when good things happen."
            : good >= 8
            ? "You are average."
            : "You are pessimistic when good things happen."
        );

        $("#total-optimism > td:nth-child(1)").text(bad - good);
        $("#total-optimism > td:nth-child(3)").text(
          bad - good >= 4
            ? "You are optimistic across the board."
            : bad - good >= 2
            ? "You are average."
            : "You are pessimistic across the board."
        );

        let hope = values.F || 0 + values.I || 0;
        $("#hope > td:nth-child(1)").text(hope);
        $("#hope > td:nth-child(3)").text(
          hope <= 4 ? "You are hopeful." : hope == 5 ? "You are average." : "You are hopeless."
        );

        $("#results").show();
        document.body.scrollIntoView({ behavior: "smooth", block: "end" });
      });
    }
  })
  .change();
