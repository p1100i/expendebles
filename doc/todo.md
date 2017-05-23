- 1.0.0
  - month based register
    + /about page link should shrink on icon if not selected
    - on normal page header menu should shrink
      - icon < to view all menu again
      - /<current-page> should be displayed
    - header bar should display selected register month in mid
    - header bar should have arrows to paginate register month

  - add favicon

  - reduce persisted data size
    - change every repeatable property to one syllable
    - use id-s instead of strings

  - basic statistics page
    - list cumulated sums for each category
    - list full sum for the month (+/- bar)

  - add more categories

  + after /data-clear the finance manager should be synced

  + add categories on registering

  + manage registered items
    + persist every change to storage
    + modify date
    + delete
    + sort items by newest timestamp
    + change amount icon to symbolize +/-
    + display items
    + select item for edit
    + add all-clear for /data
    + selecting +/- should change the selected item expense
    + remove visual negative amounts
    + edit amount
    + edit +/-

  + basic data page
    + new blank page
    + display JSON.stringify of localStorage data
    + allow to fill up localStorage from text-area
    + add copy-to-clipboard button

  + basic register an expense
    + add plus/minus icon
    + bind onclick to add expense

  + highlight selected/current anchor

- roadmap
  - switchable profiles
