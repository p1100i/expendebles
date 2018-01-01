- icebox
  - add registration timestamp for items (visualize it as well)

  - canvas/image based import/export

  - csv based export/import

  - mask values after timeout

  - add demo-data injection

  - add option to encrypt localstorage data

  - make storageService usable in iOS privateBrowsing as well
    https://stackoverflow.com/questions/14555347/html5-localstorage-error-with-safari-quota-exceeded-err-dom-exception-22-an

  - customizable categories

- next
  - add yearly statistics about monthly income/outcome/diff

+ 1.5.3
  + fix unregistered calculation w/o next/current monthly balance

+ 1.5.2
  + fix monthbegday off-by-one issue

  + fix unregistered diff calculation between months

+ 1.5.1
  + fix header spacing isssue

+ 1.5.0
  + show exported base64 data character count

  + create help content
    + add basic FAQ
    + add changelog

  + rework header
    + about/register/statistics # interval # [trends]/settings/help
    + remove page-name displacement, always show all points

  + add storage upgrade logic for data import
    + prefix exported data with version
    + compress exported string data w/ lz-string
      + JSON.stringify -> lz-compress -> base64

  + remove unnecessary .finance meta level from storage object

+ 1.4.1
  + remove unnecessary console.log on registering amount

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
