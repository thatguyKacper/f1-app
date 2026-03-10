CREATE TABLE formula_one_baseteam (
    id SERIAL PRIMARY KEY,
    api_id VARCHAR(255),
    name VARCHAR(255)
);
COPY formula_one_baseteam FROM '/jolpica-f1-csv/formula_one_baseteam.csv' WITH (FORMAT csv, HEADER true, NULL '');

CREATE TABLE formula_one_championshipsystem (
    id SERIAL PRIMARY KEY,
    api_id VARCHAR(255),
    driver_best_results INT,
    driver_season_split INT,
    eligibility INT,
    name VARCHAR(255),
    reference VARCHAR(255),
    team_best_results INT,
    team_points_per_session INT,
    team_season_split INT
);
COPY formula_one_championshipsystem FROM '/jolpica-f1-csv/formula_one_championshipsystem.csv' WITH (FORMAT csv, HEADER true, NULL '');

CREATE TABLE formula_one_pointsystem (
    id SERIAL PRIMARY KEY,
    api_id VARCHAR(255),
    driver_fastest_lap INT,
    driver_position_points INT,
    is_double_points BOOLEAN,
    name VARCHAR(255),
    partial INT,
    reference VARCHAR(255),
    shared_drive INT,
    team_fastest_lap INT,
    team_position_points INT
);
COPY formula_one_pointsystem FROM '/jolpica-f1-csv/formula_one_pointsystem.csv' WITH (FORMAT csv, HEADER true, NULL '');

CREATE TABLE formula_one_circuit (
    id SERIAL PRIMARY KEY,
    altitude INT,
    api_id VARCHAR(255),
    country VARCHAR(255),
    country_code VARCHAR(3),
    latitude FLOAT,
    locality VARCHAR(255),
    longitude FLOAT,
    name VARCHAR(255),
    reference VARCHAR(255),
    wikipedia VARCHAR(255)
);
COPY formula_one_circuit FROM '/jolpica-f1-csv/formula_one_circuit.csv' WITH (FORMAT csv, HEADER true, NULL '');

CREATE TABLE formula_one_driver (
    id SERIAL PRIMARY KEY,
    abbreviation VARCHAR(10),
    api_id VARCHAR(255),
    country_code VARCHAR(3),
    date_of_birth DATE,
    forename VARCHAR(255),
    nationality VARCHAR(255),
    permanent_car_number INT,
    reference VARCHAR(255),
    surname VARCHAR(255),
    wikipedia VARCHAR(255)
);
COPY formula_one_driver FROM '/jolpica-f1-csv/formula_one_driver.csv' WITH (FORMAT csv, HEADER true, NULL '');

CREATE TABLE formula_one_team (
    id SERIAL PRIMARY KEY,
    api_id VARCHAR(255),
    base_team_id INT REFERENCES formula_one_baseteam(id),
    country_code VARCHAR(3),
    name VARCHAR(255),
    nationality VARCHAR(255),
    reference VARCHAR(255),
    wikipedia VARCHAR(255)
);
COPY formula_one_team FROM '/jolpica-f1-csv/formula_one_team.csv' WITH (FORMAT csv, HEADER true, NULL '');

CREATE TABLE formula_one_season (
    id SERIAL PRIMARY KEY,
    api_id VARCHAR(255),
    championship_system_id INT REFERENCES formula_one_championshipsystem(id),
    wikipedia VARCHAR(255),
    year INT
);
COPY formula_one_season FROM '/jolpica-f1-csv/formula_one_season.csv' WITH (FORMAT csv, HEADER true, NULL '');

CREATE TABLE formula_one_round (
    id SERIAL PRIMARY KEY,
    api_id VARCHAR(255),
    circuit_id INT REFERENCES formula_one_circuit(id),
    date DATE,
    is_cancelled BOOLEAN,
    name VARCHAR(255),
    number INT,
    race_number INT,
    season_id INT REFERENCES formula_one_season(id),
    wikipedia VARCHAR(255)
);
COPY formula_one_round FROM '/jolpica-f1-csv/formula_one_round.csv' WITH (FORMAT csv, HEADER true, NULL '');

CREATE TABLE formula_one_teamdriver (
    id SERIAL PRIMARY KEY,
    api_id VARCHAR(255),
    driver_id INT REFERENCES formula_one_driver(id),
    role VARCHAR(50),
    season_id INT REFERENCES formula_one_season(id),
    team_id INT REFERENCES formula_one_team(id)
);
COPY formula_one_teamdriver FROM '/jolpica-f1-csv/formula_one_teamdriver.csv' WITH (FORMAT csv, HEADER true, NULL '');

CREATE TABLE formula_one_session (
    id SERIAL PRIMARY KEY,
    api_id VARCHAR(255),
    has_time_data BOOLEAN,
    is_cancelled BOOLEAN,
    number INT,
    point_system_id INT REFERENCES formula_one_pointsystem(id),
    round_id INT REFERENCES formula_one_round(id),
    scheduled_laps INT,
    timestamp TIMESTAMPTZ,
    timezone VARCHAR(50),
    type VARCHAR(10)
);
COPY formula_one_session FROM '/jolpica-f1-csv/formula_one_session.csv' WITH (FORMAT csv, HEADER true, NULL '');

CREATE TABLE formula_one_roundentry (
    id SERIAL PRIMARY KEY,
    api_id VARCHAR(255),
    car_number INT,
    round_id INT REFERENCES formula_one_round(id),
    team_driver_id INT REFERENCES formula_one_teamdriver(id)
);
COPY formula_one_roundentry FROM '/jolpica-f1-csv/formula_one_roundentry.csv' WITH (FORMAT csv, HEADER true, NULL '');

CREATE TABLE formula_one_sessionentry (
    id SERIAL PRIMARY KEY,
    api_id VARCHAR(255),
    detail VARCHAR(255),
    fastest_lap_rank INT,
    grid INT,
    is_classified BOOLEAN,
    is_eligible_for_points BOOLEAN,
    laps_completed INT,
    points FLOAT,
    position INT,
    round_entry_id INT REFERENCES formula_one_roundentry(id),
    session_id INT REFERENCES formula_one_session(id),
    status INT,
    time VARCHAR(255)
);
COPY formula_one_sessionentry FROM '/jolpica-f1-csv/formula_one_sessionentry.csv' WITH (FORMAT csv, HEADER true, NULL '');

CREATE TABLE formula_one_lap (
    id SERIAL PRIMARY KEY,
    api_id VARCHAR(255),
    average_speed FLOAT,
    is_deleted BOOLEAN,
    is_entry_fastest_lap BOOLEAN,
    number INT,
    position INT,
    session_entry_id INT REFERENCES formula_one_sessionentry(id),
    time VARCHAR(255)
);
COPY formula_one_lap FROM '/jolpica-f1-csv/formula_one_lap.csv' WITH (FORMAT csv, HEADER true, NULL '');

CREATE TABLE formula_one_pitstop (
    id SERIAL PRIMARY KEY,
    api_id VARCHAR(255),
    duration VARCHAR(255),
    lap_id INT REFERENCES formula_one_lap(id),
    local_timestamp TIME,
    number INT,
    session_entry_id INT REFERENCES formula_one_sessionentry(id)
);
COPY formula_one_pitstop FROM '/jolpica-f1-csv/formula_one_pitstop.csv' WITH (FORMAT csv, HEADER true, NULL '');

CREATE TABLE formula_one_penalty (
    id SERIAL PRIMARY KEY,
    api_id VARCHAR(255),
    earned_id INT,
    is_time_served_in_pit BOOLEAN,
    license_points INT,
    position INT,
    served_id INT,
    time VARCHAR(255)
);
COPY formula_one_penalty FROM '/jolpica-f1-csv/formula_one_penalty.csv' WITH (FORMAT csv, HEADER true, NULL '');

CREATE TABLE formula_one_driverchampionship (
    id SERIAL PRIMARY KEY,
    adjustment_type INT,
    driver_id INT REFERENCES formula_one_driver(id),
    highest_finish INT,
    is_eligible BOOLEAN,
    points FLOAT,
    position INT,
    round_id INT REFERENCES formula_one_round(id),
    round_number INT,
    season_id INT REFERENCES formula_one_season(id),
    session_id INT REFERENCES formula_one_session(id),
    session_number INT,
    win_count INT,
    year INT
);
COPY formula_one_driverchampionship FROM '/jolpica-f1-csv/formula_one_driverchampionship.csv' WITH (FORMAT csv, HEADER true, NULL '');

CREATE TABLE formula_one_teamchampionship (
    id SERIAL PRIMARY KEY,
    adjustment_type INT,
    highest_finish INT,
    is_eligible BOOLEAN,
    points FLOAT,
    position INT,
    round_id INT REFERENCES formula_one_round(id),
    round_number INT,
    season_id INT REFERENCES formula_one_season(id),
    session_id INT REFERENCES formula_one_session(id),
    session_number INT,
    team_id INT REFERENCES formula_one_team(id),
    win_count INT,
    year INT
);
COPY formula_one_teamchampionship FROM '/jolpica-f1-csv/formula_one_teamchampionship.csv' WITH (FORMAT csv, HEADER true, NULL '');

CREATE TABLE formula_one_championshipadjustment (
    id SERIAL PRIMARY KEY,
    adjustment INT,
    api_id VARCHAR(255),
    driver_id INT REFERENCES formula_one_driver(id),
    points FLOAT,
    season_id INT REFERENCES formula_one_season(id),
    team_id INT REFERENCES formula_one_team(id)
);
COPY formula_one_championshipadjustment FROM '/jolpica-f1-csv/formula_one_championshipadjustment.csv' WITH (FORMAT csv, HEADER true, NULL '');
