# Project Structure
For a full application I would use a standard 3 layer approach. 
Application code would be sorted into directories described below:

## Presentation Layer
- **/controllers**: Route handlers
- **/middleware**: Authentication, logging, error handling
- **/routes**

## Business Logic Layer
- **/services**

## Data Access Layer
- **/db**

Code will be written here to interact with the database.

## Other
Other code defining infrastructure and database schema could also exist in this repository.

# Modularity / Maintainability
Separating the application code into the above layers supports a modular approach, this should be continued by ensuring that the code in each layer is further divided into self-contained submodules.
This allows for easier modifications, fault isolation and testing. 

# Logging
A logging library should be selected (perhaps [winston](https://github.com/winstonjs/winston)) and configured to provide logging functionality in a standardised format.
Correlation IDs should be employed to group log items by request.

A middleware should be used to log each request made, time taken, correlation ID, response code, and requester information.

Logs should be sent to an aggregation service such as Elastic or Datadog.
Here analysis can be done to spot problematic requests/ behaviour.

# Error handling
An error handling middleware should be used to standardise error logging and response sent to the user.
Alerting should be set up to provide notifications once a threshold has been passed.

# Authentication / Authorization
This should be a high priority given the nature of the data being handled.
Signed JWTs should be provided to users to provide access to the application.

Every controller should determine it's own access control policy based on the data that is being manipulated/ viewed.

# Scalability and Future
The architecture described lends its self to horizontal scaling.
An orchestration tool such as Kubernetes could be used to automate this process.

Adopting a caching strategy would reduce the number of calls to the database and speed up response times. Software such as Redis or Memcached could be used for this.

Depending on the DB being used, a separate scaling strategy would need to be employed.
Relational databases are harder to scale horizontally and so a vertical approach should be followed first.
This would involve allocating more compute hardware to the DB instance.

As the application grows it may make sense to divide it into multiple smaller services.