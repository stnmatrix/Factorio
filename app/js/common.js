$(window).on("load", () => {
  $(".preloader").delay(2000).fadeOut("slow");
  $(".loader-container").delay(5000).removeClass("hidden");
});
$(function() {
  const mainContent = $(".main-content .container"),
    select = $("#dir"),
    section = mainContent.find(".sections .section"),
    sectionTemplate = $(
      `<div class="section"><pre></pre><div class="table-wrap"><table class="table table-condensed section-table"><thead><tr><td>VARIABLE NAME</td><td>EN</td><td>RU</td></tr></thead><tbody></tbody></table></div`
    ),
    url = "./result.php";

  /*		Get Sections List		*/

  $.getJSON(`${url}?getlist`, response => {
    let options = [];

    if (response === []) {
      error("Empty response");
    }

    $.each(response, (i, element) => {
      options.push($(`<option value=${i}>${element}</option>`));
      select.append(options);
    });

    select.on("change", () => {
      let dirIndex = $(this).find(":selected").val();

      $(".loader-container").addClass("hidden");
      $(".main-content .container > *").addClass("hidden");

      const requestContent = $.getJSON(
        `${url}?getdir=${dirIndex}`,
        response => {
          let emptyTable = [];

          $.each(response, filename => {
            if (!response || response === "") error("Error at request content");
            else renderContent(filename, response[filename]);
            emptyTable = $("tbody:empty");
          });

          $.each(emptyTable, (i, tbody) => {
            $(tbody).closest(".table-wrap").slideToggle("fast");
            $(tbody)
              .closest(".section")
              .find(".fa")
              .toggleClass("fa-sort-down")
              .toggleClass("fa-sort-up");
          });
        }
      ).fail(error => {
        error("Error at request content");
      });
    });
  })
    .done(() => {
      select.selectize({});
    })
    .fail(() => {
      error("Connection failed");
    });

  function renderContent(filename, object) {
    /* File render */

    let filesDiv = $(".hidden_template").clone();

    filesDiv
      .removeClass("hidden_template")
      .css("display", "flex")
      .appendTo(mainContent);

    filesDiv
      .find(".file > pre")
      .text(filename)
      .append('<i class="fa fa-sort-down"></i>');

    /* Section render */

    $.each(object, (groupname, obj) => {
      let sectionClone = sectionTemplate.clone(),
        tbody = sectionClone.find("tbody");

      sectionClone
        .find("pre")
        .append(groupname)
        .append('<i class="fa fa-sort-down"></i>');

      /* Tr render */

      $.each(obj, (i, val) => {
        let tr = $(`<tr></tr>`), placeholder = "", status = "";

        if (val.ru === "") {
          placeholder = "Введите перевод";
        } else {
          placeholder = val.ru;
        }

        if (val.status === 0) {
          status = "Edit";
        } else if (val.status === 1) {
          status = "New!";
        } else {
          status = "Non-edit";
        }

        tr.append(`<td><span>${val.var}</span></td>`);
        tr.append(`<td><span>${val.en}</span></td>`);
        tr.append(
          `<td><span class='ru-translate' title=${status}>${val.ru === "" ? "Не указано" : val.ru}</span><input type="text" class="td-edit hidden invisible" data-status=${val.status} value="${!val.ru && val.ru === "" ? "" : val.ru.replace(/\"/g, "&quot;")}"/></td>`
        );

        let ru = tr.children("td").eq(2);

        switch (val.status) { // TR data status 0: default, 1: new, 2: non-edit
          case 1:
            ru.children("span.ru-translate").addClass("new");
            tr.addClass("bg");
            break;
          case 2:
            ru.append(`<i class="fa fa-trash-o" title="Delete"></i>`);

            ru.children("span.ru-translate").addClass("old");
            tr.addClass("bg");
            break;
        }
        ru.children(".td-edit").attr("placeholder", placeholder);

        tr.appendTo(tbody);
      });
      sectionClone.appendTo(filesDiv.find(".sections"));
    });
  }

  /*		Additional functions		*/

  function error(msg) {
    let div = $('<div class="content-error"></div>'),
      errorText = $(`<h1>${msg}</h1>`);

    div.append(errorText).addClass("blink");

    mainContent.html("").append(div);
  }

  /*	Find && Replace	*/

  function replace(ruValue, trElement) {
    if (!ruValue) {
      console.error("Value is not defined");
      return false;
    }

    let enValue = trElement.children("td").eq(1).text(), input = [];

    $.each($(".sections tbody").find("tr"), (i, tr) => {
      let enTD = $(tr).children("td").eq(1), en = enTD.text();

      if (enValue === en) {
        if (
          $(tr).children("td").eq(2).text() !==
          trElement.children("td").eq(2).text()
        ) {
          // другие элементы
          let span = $(tr).find(".ru-translate");
          span.text(ruValue);
          input.push(span.siblings(".td-edit"));
        } else {
          // этот же элемент
          input.push(trElement.find(".td-edit"));
        }
      }
    });
    return input;
  }

  /*	Send to Server	*/

  function sendValueToServer(input, value, method) {
    let store = {},
      dir = $(".selectize-dropdown-content > .option.selected.active").attr(
        "data-value"
      ),
      file = input.closest(".file").children("pre"),
      section = input.closest(".section").children("pre"),
      variable = input.closest("tr").children("td").eq(0).children("span");
    store.dir = dir;
    store.filename = file.text();
    store.sectionname = section.text();
    store.variablename = variable.text();

    if (method === "edit") {
      store.ru = value || "";
      $.post(url, store, (data, textStatus, jqXHR) => {
        if (jqXHR.status === 200) {
          input
            .closest("tr")
            .children("td:eq(2)")
            .has("span")
            .addClass("blink send-success")
            .delay(1400)
            .queue(function() {
              $(this).removeClass("blink send-success").dequeue();
            });
        } else {
          input
            .closest("tr")
            .children("td:eq(2)")
            .has("span")
            .addClass("blink send-error");
        }
      }).fail(error => {
        input
          .closest("tr")
          .children("td:eq(2)")
          .has("span")
          .addClass("blink send-error");
      });
    } else if (method === "delete") {
      store.del = "delete";
      $.post(url, store, (data, textStatus, jqXHR) => {
        if (jqXHR.status === 200) {
          input.closest("tr").hide(200).delay(200).queue(function() {
            $(this).detach().dequeue();
          });
        } else {
          input.closest("tr").addClass("blink send-error");
        }
      }).fail(error => {
        input.closest("tr").addClass("blink send-error");
      });
    }
  }

  /*		Show/Hide function		*/

  function showElement(element, classes) {
    if ($(document).has(element)) {
      let cls = classes || "";
      element.fadeToggle().toggleClass(cls);
      return element;
    }
  }

  function hideElement(element, classes) {
    if ($(document).has(element)) {
      let cls = classes || "";
      element.fadeToggle().toggleClass(cls).focus();
      return element;
    }
  }

  /*		Events		*/

  mainContent.on("click", ".file pre", event => {
    // slideToggle() on file
    event.stopPropagation();
    $(event.target).siblings(".sections").slideToggle(400);
    $(event.target)
      .children(".fa")
      .toggleClass("fa-sort-down")
      .toggleClass("fa-sort-up");
  });

  mainContent.on("click", ".section pre", event => {
    // slideToggle() section
    event.stopPropagation();
    $(event.target).siblings(".table-wrap").slideToggle(400);
    $(event.target)
      .has(".fa")
      .toggleClass("fa-sort-up")
      .toggleClass("fa-sort-down");
  });

  mainContent.on("click", "tbody tr .ru-translate", event => {
    // RU td click
    event.stopPropagation();

    let input = $(event.target).siblings("input.td-edit"),
      span = $(event.target).closest("td").children("span"),
      activeInput = mainContent.find("input.td-edit.active"),
      activeInputSibling = activeInput
        .closest("td")
        .children("span.ru-translate");

    if ($(event.target).hasClass("old")) return false;

    if ($(event.target).closest("tr").hasClass("blink send-error")) {
      $(event.target).closest("tr").removeClass("blink send-error");
    }

    if (activeInput.hasClass("active")) {
      hideElement(activeInput, "hidden invisible active");
      showElement(activeInputSibling, "invisible hidden");

      if (
        activeInput.val() !== "" &&
        activeInput.val() !== activeInputSibling.text()
      ) {
        activeInputSibling.text(activeInput.val());
        sendValueToServer(activeInput, activeInput.val(), "edit");
      }
    }
    hideElement(input, "hidden invisible active");
    showElement(span, "invisible hidden");
  });

  mainContent.on("keydown", "tbody .td-edit", event => {
    // keydown on RU td
    event.stopPropagation();

    let span = $(event.target).closest("td").children("span"),
      value = $(event.target).val();

    switch (event.which) {
      case 13: // Enter
        showElement(span, "invisible hidden");
        hideElement($(event.target), "hidden invisible active");

        if (value !== "" && value !== span.text()) {
          let replaceInput = [];

          span.text(value);
          $(event.target).attr("placeholder", value);

          replaceInput = [...replace(value, $(event.target).closest("tr"))];
          console.log(replaceInput);
          if (replaceInput.length > 0) {
            $.each(replaceInput, (i, input) => {
              input.val(value);
              input.attr("placeholder", value);
              sendValueToServer(input, value, "edit"); // send to server next edit inputs
            });
          }
        }
        break;
      case 27: // Esc
        showElement(span, "invisible hidden");
        hideElement($(event.target), "hidden invisible active");
        $(event.target).val("");
        break;
    }
  });

  $(document).on("click", event => {
    let input = mainContent.find(".td-edit.active"),
      span = input.closest("td").children(".ru-translate");

    if (!mainContent.has(event.target).length) {
      showElement(span, "invisible hidden");
      hideElement(input, "hidden invisible active");
      input.val(span.text());
    }
  });

  mainContent.on("click", ".section .fa-trash-o", event => {
    // delete tbody line
    event.stopPropagation();
    sendValueToServer($(event.target), null, "delete");

    let fileDiv = $(event.target).closest(".file"),
      section = $(event.target).closest(".section"),
      tbody = $(event.target).closest("tbody");

    if (tbody.find("tr").length <= 1) {
      tbody.closest(".table-wrap").slideToggle(400);
      section
        .children("pre")
        .children(".fa")
        .toggleClass("fa-sort-down")
        .toggleClass("fa-sort-up");
    }
  });

  $(window).scroll(() => {
    if ($(this).scrollTop() > 1200) {
      $(".up").addClass("active");      
    } else if ($(this).scrollTop() > 400) {
      $(".down").addClass("active");
    } else {
      $(".up").removeClass("active");
      $(".down").removeClass("active");
    }

  });

  $(".up").on("click", () => {
    $("html, body").stop().animate({ scrollTop: 0 }, "slow", "swing");
  });
  $(".down").on("click", () => {
    let height = mainContent.height();
    $("html, body").stop().animate({ scrollTop: height }, "slow", "swing");
  });
});

