CREATE TABLE overdubs (
  ID SERIAL PRIMARY KEY,
  url VARCHAR(255) NOT NULL,
  nudge FLOAT NOT NULL
  gain FLOAT NOT NULL
);

INSERT INTO overdubs (url, nudge, gain)
VALUES  ('https://remote-band.s3.amazonaws.com/06/05/2020,%2015:42:28', 0, 1);
