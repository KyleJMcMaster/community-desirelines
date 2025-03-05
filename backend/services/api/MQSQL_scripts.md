**Start MYSQL server**

windows + R, search ``services.msc``, find MYSQL90

**Stop MYSQL server**

windows + R, search ``services.msc``, find MYSQL90

**check status**

``systemctl status mysql``

**Helpful Commands**

<a href='https://dev.mysql.com/doc/mysql-getting-started/en/#mysql-getting-started-basic-ops'> Docs</a>


CREATE TABLE feature_collections (
    collection_id VARCHAR(36) PRIMARY KEY,
    creation_date TIMESTAMP NOT NULL,
    creation_source VARCHAR(20),
    is_shared BOOL NOT NULL
);

CREATE TABLE features ENGINE = InnoDB(
    feature_id VARCHAR(36) PRIMARY KEY,
    collection_id VARCHAR(36) NOT NULL, 
    geometry_type VARCHAR(20) NOT NULL,
    feature_type VARCHAR(20) NOT NULL,
    geometry GEOMETRY NOT NULL SRID 4326,
    FOREIGN KEY (collection_id) REFERENCES feature_collections(collection_id)
);
