- next
  - remove unnecessary .finance meta level from storage object

  + fix error on typing zero to date-time of expense

  + fix protractor spec to not depend on current date

  + store last selected interval

  + showing year for interval

+ 1.4.0
  + import/export
    + use base64 encoded string (extra field for verbose display)
    + add monthbeg day to the serialized data

  + add protractor specs
    + create some items modify the serialized data, import, check item

+ 1.3.1
  + implement basic protractor testing

  + if registering not into the current month use translate by month beg not month half

  + upgrade storage to 3 (remove balance timestamps and add month index)

  + fix registering an item in a month w/ a different month date (creates multiple items)

  + fix setting month starting day (makes offset error of one)

  + reimplement delete button functionality

  + edit balance button string to long for mobile

+ 1.3.0
  + customizable month start day

  + summed up finance
    + add option to register balances per month
      + UI / controller logic to register balances
      + storage upgrade
        + allowing balances in finance
        + rename items to transactions

    + see unexplained entry about diff between two month

+ 1.2.1
  + use icons instead of strings in menubar

  + fix displayed json importing

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
  - add storage upgrade logic for data import

  - compress localstorage data

  - add option to encrypt localstorage data

  - mask values after timeout
    - add icon for hide/show
    - centerize interval select element on header

  - add FAQ item about category balancing

  - add changelog to help page

  - add demo-data injection

  - customizable categories
