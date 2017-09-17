- 1.3.0
  - navigate back to /home on selected-menu item href

  - fix redundant item registering on not current interval item-creation

  - add changelog to help page

  - mask values after timeout
    - add icon for hide/show
    - centerize interval select element on header

  - add FAQ item about category balancing


+ 1.2.0
  + measure/show client side data storage size

+ 1.1.0
  + statistics should display title if only one type of item is registered

  + income/expense in a category should cancel out one-another on statistics

  + add message to /reg if no item is present

  + show menu items always if window is wide enough

  + add gift / entertainement category

+ 1.0.0
  + basic statistics page
    + list cumulated sums for each category
    + list full sum for the month (+/- bar)

  + add basic FAQ page

  + month based register
    + /about page link should shrink on icon if not selected
    + on normal page header menu should shrink
      + icon ^ to view all menu again
      + /<current-page> should be displayed
    + header bar should display selected register month in mid
    + header bar should have arrows to paginate register month

  + reduce persisted data size
    + change every repeatable property to one character
    + use id-s instead of strings for category

  + add more categories

  + add favicon

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

- icebox
  - add info from balanced categories on statistic
  - add demo-data injection
  - implement basic protractor testing
  - amount-edit only on double-click on item
  - customizable month interval
  - customizable categories
