-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema veterinaria
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema veterinaria
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `veterinaria` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `veterinaria` ;

-- -----------------------------------------------------
-- Table `veterinaria`.`duenio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `veterinaria`.`duenio` (
  `id_duenio` INT NOT NULL AUTO_INCREMENT,
  `nombre_duenio` VARCHAR(50) NOT NULL,
  `apellido_duenio` VARCHAR(50) NOT NULL,
  `telefono_duenio` VARCHAR(20) NOT NULL,
  `mail_duenio` VARCHAR(40) NOT NULL,
  `dni` VARCHAR(30) NOT NULL,
  `direccion` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id_duenio`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `veterinaria`.`estudio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `veterinaria`.`estudio` (
  `id_estudio` INT NOT NULL AUTO_INCREMENT,
  `nombre_estudio` VARCHAR(40) NOT NULL,
  `descripcion_estudio` VARCHAR(100) NOT NULL,
  `precio_estudio` DECIMAL(30,5) NOT NULL,
  PRIMARY KEY (`id_estudio`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `veterinaria`.`mascota`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `veterinaria`.`mascota` (
  `id_mascota` INT NOT NULL AUTO_INCREMENT,
  `nombre_mascota` VARCHAR(50) NOT NULL,
  `especie` VARCHAR(30) NOT NULL,
  `raza` VARCHAR(30) NOT NULL,
  `castrado` TINYINT(1) NOT NULL,
  `sexo` CHAR(1) NOT NULL,
  `fechaNac` DATE NOT NULL,
  `id_duenio` INT NOT NULL,
  PRIMARY KEY (`id_mascota`),
  INDEX `id_duenio` (`id_duenio` ASC) VISIBLE,
  CONSTRAINT `mascota_ibfk_1`
    FOREIGN KEY (`id_duenio`)
    REFERENCES `veterinaria`.`duenio` (`id_duenio`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `veterinaria`.`medicamento`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `veterinaria`.`medicamento` (
  `id_medicamento` INT NOT NULL AUTO_INCREMENT,
  `nombre_medicamento` VARCHAR(30) NOT NULL,
  `cantidadRestante` INT UNSIGNED NOT NULL,
  `cantidadMinima` INT UNSIGNED NOT NULL,
  `precio_medicamento` DECIMAL(30,5) NOT NULL,
  PRIMARY KEY (`id_medicamento`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `veterinaria`.`proveedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `veterinaria`.`proveedor` (
  `id_prov` INT NOT NULL AUTO_INCREMENT,
  `nombre_prov` VARCHAR(40) NOT NULL,
  `cuit_prov` VARCHAR(40) NOT NULL,
  `mail_prov` VARCHAR(40) NOT NULL,
  `razonSocial` VARCHAR(60) NOT NULL,
  `telefono_prov` VARCHAR(30) NOT NULL,
  `direccion_prov` VARCHAR(40) NOT NULL,
  PRIMARY KEY (`id_prov`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `veterinaria`.`medicamento_proveedor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `veterinaria`.`medicamento_proveedor` (
  `id_medicamento` INT NOT NULL,
  `id_prov` INT NOT NULL,
  `fecha_desde` DATE NOT NULL,
  `fecha_hasta` DATE NULL DEFAULT NULL,
  PRIMARY KEY (`id_medicamento`, `id_prov`, `fecha_desde`),
  INDEX `id_prov` (`id_prov` ASC) VISIBLE,
  CONSTRAINT `medicamento_proveedor_ibfk_1`
    FOREIGN KEY (`id_medicamento`)
    REFERENCES `veterinaria`.`medicamento` (`id_medicamento`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `medicamento_proveedor_ibfk_2`
    FOREIGN KEY (`id_prov`)
    REFERENCES `veterinaria`.`proveedor` (`id_prov`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `veterinaria`.`veterinario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `veterinaria`.`veterinario` (
  `id_veterinario` INT NOT NULL AUTO_INCREMENT,
  `nombre_veterinario` VARCHAR(50) NOT NULL,
  `apellido_veterinario` VARCHAR(50) NOT NULL,
  `telefono_veterinario` VARCHAR(20) NOT NULL,
  `matricula` VARCHAR(20) NOT NULL,
  `especialidad` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id_veterinario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `veterinaria`.`turno`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `veterinaria`.`turno` (
  `id_turno` INT NOT NULL AUTO_INCREMENT,
  `fechahora_turno` DATETIME NOT NULL,
  `estado_turno` VARCHAR(10) NOT NULL,
  `observaciones_turno` VARCHAR(100) NULL DEFAULT NULL,
  `id_mascota` INT NOT NULL,
  `id_veterinario` INT NOT NULL,
  PRIMARY KEY (`id_turno`),
  INDEX `id_mascota` (`id_mascota` ASC) VISIBLE,
  INDEX `id_veterinario` (`id_veterinario` ASC) VISIBLE,
  CONSTRAINT `turno_ibfk_1`
    FOREIGN KEY (`id_mascota`)
    REFERENCES `veterinaria`.`mascota` (`id_mascota`),
  CONSTRAINT `turno_ibfk_2`
    FOREIGN KEY (`id_veterinario`)
    REFERENCES `veterinaria`.`veterinario` (`id_veterinario`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `veterinaria`.`resolucionturno`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `veterinaria`.`resolucionturno` (
  `id_resturno` INT NOT NULL AUTO_INCREMENT,
  `fecha_resturno` DATE NOT NULL,
  `diagnostico` VARCHAR(100) NULL DEFAULT NULL,
  `tratamiento` VARCHAR(200) NULL DEFAULT NULL,
  `peso` VARCHAR(40) NULL DEFAULT NULL,
  `observaciones_resolucion` VARCHAR(100) NULL DEFAULT NULL,
  `id_turno` INT NOT NULL,
  PRIMARY KEY (`id_resturno`),
  INDEX `id_turno` (`id_turno` ASC) VISIBLE,
  CONSTRAINT `resolucionturno_ibfk_1`
    FOREIGN KEY (`id_turno`)
    REFERENCES `veterinaria`.`turno` (`id_turno`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `veterinaria`.`resolucion_medicamentos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `veterinaria`.`resolucion_medicamentos` (
  `id_resturno` INT NOT NULL,
  `id_medicamento` INT NOT NULL,
  `cantidad_usada` INT NOT NULL,
  PRIMARY KEY (`id_resturno`, `id_medicamento`),
  INDEX `id_medicamento` (`id_medicamento` ASC) VISIBLE,
  CONSTRAINT `resolucion_medicamentos_ibfk_1`
    FOREIGN KEY (`id_resturno`)
    REFERENCES `veterinaria`.`resolucionturno` (`id_resturno`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `resolucion_medicamentos_ibfk_2`
    FOREIGN KEY (`id_medicamento`)
    REFERENCES `veterinaria`.`medicamento` (`id_medicamento`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `veterinaria`.`rol`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `veterinaria`.`rol` (
  `id_rol` INT NOT NULL AUTO_INCREMENT,
  `nombre_rol` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`id_rol`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `veterinaria`.`tipovacuna`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `veterinaria`.`tipovacuna` (
  `id_tipovac` INT NOT NULL AUTO_INCREMENT,
  `nombre_tipovac` VARCHAR(30) NOT NULL,
  `descripcion_tipovac` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id_tipovac`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `veterinaria`.`turno_estudio`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `veterinaria`.`turno_estudio` (
  `id_turno` INT NOT NULL,
  `id_estudio` INT NOT NULL,
  PRIMARY KEY (`id_turno`, `id_estudio`),
  INDEX `id_estudio` (`id_estudio` ASC) VISIBLE,
  CONSTRAINT `turno_estudio_ibfk_1`
    FOREIGN KEY (`id_turno`)
    REFERENCES `veterinaria`.`turno` (`id_turno`),
  CONSTRAINT `turno_estudio_ibfk_2`
    FOREIGN KEY (`id_estudio`)
    REFERENCES `veterinaria`.`estudio` (`id_estudio`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `veterinaria`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `veterinaria`.`usuario` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(15) NOT NULL,
  `contrasenia` VARCHAR(15) NOT NULL,
  `id_rol` INT NOT NULL,
  `id_veterinario` INT NULL DEFAULT NULL,
  `id_duenio` INT NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `username` (`username` ASC) VISIBLE,
  INDEX `id_rol` (`id_rol` ASC) VISIBLE,
  INDEX `id_veterinario` (`id_veterinario` ASC) VISIBLE,
  INDEX `id_duenio` (`id_duenio` ASC) VISIBLE,
  CONSTRAINT `usuario_ibfk_1`
    FOREIGN KEY (`id_rol`)
    REFERENCES `veterinaria`.`rol` (`id_rol`),
  CONSTRAINT `usuario_ibfk_2`
    FOREIGN KEY (`id_veterinario`)
    REFERENCES `veterinaria`.`veterinario` (`id_veterinario`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `usuario_ibfk_3`
    FOREIGN KEY (`id_duenio`)
    REFERENCES `veterinaria`.`duenio` (`id_duenio`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `veterinaria`.`vacuna`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `veterinaria`.`vacuna` (
  `id_vac` INT NOT NULL AUTO_INCREMENT,
  `fechaColocacion` DATE NOT NULL,
  `id_mascota` INT NOT NULL,
  `id_tipovac` INT NOT NULL,
  PRIMARY KEY (`id_vac`),
  INDEX `id_mascota` (`id_mascota` ASC) VISIBLE,
  INDEX `id_tipovac` (`id_tipovac` ASC) VISIBLE,
  CONSTRAINT `vacuna_ibfk_1`
    FOREIGN KEY (`id_mascota`)
    REFERENCES `veterinaria`.`mascota` (`id_mascota`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `vacuna_ibfk_2`
    FOREIGN KEY (`id_tipovac`)
    REFERENCES `veterinaria`.`tipovacuna` (`id_tipovac`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
