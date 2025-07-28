# Calendar

This page is the calendar of the system and is the main home page. It is used to schedule and view repair jobs, including some details about them and how long they are scheduled in for on a given day, and to navigate to their individual page. It is also used to schedule over events non repair-related.

### Components

- **Calendar**: Main parent component.
- **CalendarDayView**: Day view of the calendar.
- **CalendarWeekView**: Week view of the calendar.
- **CalendarMonthView**: Month view of the calendar.
- **CalendarEvent**: Calendar event to be displayed on the calendar.
- **DragOverlayCalendarEvent**: A container for a calendar event which is being dragged and can move between DND contexts (weeks).
- **AddCalendarEventButton**: Button that shows on hover of calendar grid day to add an event.
- **ExistingCalendarEventPopover**: Calendar event popover allowing editing and deleting of an existing calendar event.
- **NewCalendarEventPopover**: Calendar event popover allowing the creation of a new calendar event.
- **NavigationCalendar**: Sidebar style month view calendar that allows quick and easy navigation through the calendar in all views.
- **SchedulingRepairWidget**: Widget that shows when scheduling repair showing details of repair and a close button to stop scheduling said repair.

### External Dependencies

Axios is used to call the API to communicate with the backend and database.

DND Kit is used to handle drag and drop.

## Calendar (Component)

The main parent component, storing and managing the data such as calendar events, current settings, the calendar mode and current day/week/month being viewed, drag and drop and event popovers.

It renders a calendar grid with calendar events, buttons for selecting calendar mode and navigating immediately forwards and backwards, contains the navigation calendar, any widgets and any popovers. 

It takes no props or parameters, but can be passed the details of a scheduling repair through location state from the repair page. This state is cleared after being read so does not remain when reloading the page.

### Key Functions
- **`onClickCalendarEvent(e, calendarEvent)`** function to either open popover for calendar event if single click or navigate to repair's page if double click. Takes event object from click `e` and the calendar event object from the event clicked `calendarEvent` as parameters.

## Calendar Day View (Component)

The day view of the calendar. It has a title for the day currently being viewed, and then columns for each repairer, with the events for that day displayed.

### Props
- **`calendarEvents`** list of all calendar event objects.
- **`date`** a date object for the date to be shown.
- **`repairers`** a list of repairers, each an object with an id, name and list of hours for each working day of the week.
- **`detailsSettings`** is the settings object for which details are toggled to be shown on both day view and week view. This is to be passed on to calendar events.
- **`jobTypes`** is the settings object for job types, and is used to render the job type of a repair if toggled in settings. This is to be passed on to calendar events.
- **`instrumentStatuses`** is the settings object for instrument statuses, and is used to render the status of a repair's instrument if toggled in settings. This is to be passed on to calendar events.
- **`onClickCalendarEvent(e, calendarEvent)`** is a function to call when a calendar event is clicked, passing the event object `e` given by the click and the calendar event object `calendarEvent` for the event clicked.

## Calendar Week View (Component)

The week view of the calendar. It uses a CSS grid, has the days of the week being viewed across the top, and rows for each repairer, with the events for that day and repairer displayed in each grid box.

### Props
- **`calendarEvents`** list of all calendar event objects.
- **`firstWeekDate`** a date object for the first day of the week being shown.
- **`repairers`** a list of repairers, each an object with an id, name and list of hours for each working day of the week.
- **`detailsSettings`** is the settings object for which details are toggled to be shown on both day view and week view. This is to be passed on to calendar events.
- **`jobTypes`** is the settings object for job types, and is used to render the job type of a repair if toggled in settings. This is to be passed on to calendar events.
- **`instrumentStatuses`** is the settings object for instrument statuses, and is used to render the status of a repair's instrument if toggled in settings. This is to be passed on to calendar events.
- **`schedulingRepairDeadline`** deadline for currently scheduling repair (if there is one) to highlight that day in yellow on the calendar.
- **`onClickCalendarEvent(e, calendarEvent)`** is a function to call when a calendar event is clicked, passing the event object `e` given by the click and the calendar event object `calendarEvent` for the event clicked.
- **`openAddCalendarEventPopover(e, date, repairerId)`** is a function to call when the add calendar event button is clicked, passing the event object `e` given by the click, the button's date object `date` and the id of the button's repairer `repairerId`.

### Key Functions
- **`getRepairerCalendarGridBoxes(repairer)`** returns a list of grid box components for a repairer, each with their corresponding calendar events. Its only parameter is the repairer object of the repairer you want the grid boxes for `repairer`.

## Calendar Month View (Component)

The month view of the calendar. It uses a CSS grid, has the days of the month split into rows of weeks and columns for days of each week. They each have a colour corresponding to how quiet or busy the day is, so it works as a heatmap for the month.

### Props
- **`calendarEvents`** list of all calendar event objects.
- **`firstMonthDate`** a date object for the first day of the week being shown.
- **`repairers`** a list of repairers, each an object with an id, name and list of hours for each working day of the week.
- **`repairerFilter`** id of a repairer to filter by, or 0 for all repairers.
- **`navigateToWeek(firstWeekDate)`** is a function to call when a day is clicked on the month view in order to navigate to the clicked week. Its only parameter is the date object for the first day of said week `firstWeekDate`.

### Key Functions
- **`getDayGridBoxes()`** returns a list of grid box components for each day in the month, each with a colour corresponding to how quiet or busy that day is.


## Calendar Event (Component)

This component is rendered in the calendar for every event (in day and week mode), its box corresponding the the event's repairer and date.

It displays details (depending on which are toggled to be displayed in settings) about the event and can be drag and dropped to over days (on week mode only).

### Props
- **`calendarEvent`** is the event object the calendar event component is rendering.
- **`mode`** is the current calendar mode/view, and is a value of the `calendarModes` enum.
- **`detailsSettings`** is the settings object for which details are toggled to be shown on both day view and week view.
- **`jobTypes`** is the settings object for job types, and is used to render the job type of a repair if toggled in settings.
- **`instrumentStatuses`** is the settings object for instrument statuses, and is used to render the status of a repair's instrument if toggled in settings.
- **`overlay`** (optional, default false) is for the a drag overlay calendar event which can be dragged between DND contexts, and stops the event using the draggable reference.

### Key Functions
- **`getRenderedDetails()`** ensures necessary data has been loaded and is available, and returns JSX elements with details depending on what is toggled to be shown in settings.

## Drag Overlay Calendar Event (Component)

A container for the calendar event that is curently being dragged. This is so it can be moved between weeks, as each week has a separate drag and drop context. They key thing is it sets the prop `overlay` of the calendar event to true, meaning it doesn't have the draggable reference.

## Add Calendar Event Button (Component)

A button for each non-disabled calendar grid box in the week view. Clicking it opens the create calendar event popover. It only shows when the cursor is hovering over it.

### Props
- **`onClick`** function to open the popover on click.

## Existing Calendar Event Popover (Component)

A popover for editing and deleting calendar events. For repairs it includes the ability to change the repair, for other events it includes the ability to change the title and description, and toggle whether it is an all day event. For all events it includes the ability to change the date and time scheduled.

### Props
- **`calendarEvent`** calendar event object for the clicked event.
- **`position`** list with x and y position to render the popover.
- **`updateCalendarEvent(calendarEvent)`** function to update a calendar event. Takes parameter `calendarEvent` which is the updated calendar event object.
- **`deleteCalendarEvent()`** function to delete calendar event.
- **`closeFunction()`** function to call to close the popover.

## New Calendar Event Popover (Component)

A popover for creating calendar events. For repairs you can give a repair and time to schedule, for other events you can give a title and description, and either a time to schedule or toggle it as an all day event.

### Props
- **`date`** the date clicked to create the new calendar event.
- **`repairerId`** the id of the repairer for the new calendar event.
- **`schedulingRepair`** the id of the repair being scheduled, if a repair is being scheduled.
- **`position`** list with x and y position to render the popover.
- **`createCalendarEvent(calendarEvent)`** function to create a calendar event, taking parameter `calendarEvent` which the the calendar event object of the event to be created.
- **`cancel()`** function to close the popover and cancel creating the calendar event.

## Navigation Calendar (Component)

A sidebar style month view calendar. Can click on days, weeks or months to navigate them to them, and can use arrows to view different months.

### Props
- **`mode`** the current calendar mode, as a value of the `calendarModes` enum.
- **`year`** the year of the currently selected month, week or day.
- **`month`** the month of the currently selected month, week or day.
- **`day`** the day of the currently selected day or the first day of the currently selected week of month.
- **`navigateToMonth(month)`** function to navigate the calendar to a given month. Parameter `month` is a date object of the month to navigate to.
- **`navigateToWeek(firstWeekDate)`** function to navigate the calendar to a given week. Parameter `firstWeekDate` is a date object of the first date of the week to navigate to.
- **`navigateToDay(date)`** function to navigate the calendar to a given day. Parameter `date` is a date object of the day to navigate to.

### Key Functions
- **`handleDateClick(dateClicked)`** navigated to the correct day, week or month (depending on the view) based on the date clicked. Parameter `dateClicked` is a date object for the date clicked.
- **`getRenderedDays()`** returns a list of weeks, each containing day buttons, for the showing month. The days and weeks can be clicked to navigate.

## Scheduling Repair Widget (Component)

A widget that appears under the navigation calendar when scheduling a repair, giving details such as which repair it is and how long it's estimated to take. While this is open, all calendar events being added will automatically fill with the correct repair id.

### Props
- **`schedulingRepair`** is the repair object for the repair being scheduled.
- **`removeSchedulingRepair()`** is a function to call when the close button is pressed to stop scheduling the repair.

## Filter By Repairer Widget (Component)

A widget with a dropdown select for filtering by repairer. By default it is set to 'All Repairers'.

### Props
- **`repairers`** a list of repairer objects.
- **`repairerFilter`** the id of the repairer currently filtering by, or 0 if all repairers.
- **`updateRepairerFilter(repairerFilter)`** function to update the repairer filer. Parameter `repairerFilter` is the id of the new repairer ot filter by.