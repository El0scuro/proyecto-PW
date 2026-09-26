-- MySQL dump 10.13  Distrib 8.0.19, for Win64 (x86_64)
--
-- Host: localhost    Database: proyecto-pw
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `asignatura`
--

DROP TABLE IF EXISTS `asignatura`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `asignatura` (
  `Codigo` varchar(100) NOT NULL,
  PRIMARY KEY (`Codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `asignatura`
--

LOCK TABLES `asignatura` WRITE;
/*!40000 ALTER TABLE `asignatura` DISABLE KEYS */;
INSERT INTO `asignatura` VALUES ('INF-111'),('INF-112'),('INF-114'),('INF-115'),('INF-116'),('INF-213');
/*!40000 ALTER TABLE `asignatura` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `edificio`
--

DROP TABLE IF EXISTS `edificio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `edificio` (
  `ID_Edificio` int NOT NULL AUTO_INCREMENT,
  `Direccion` varchar(100) NOT NULL,
  `Nombre` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`ID_Edificio`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `edificio`
--

LOCK TABLES `edificio` WRITE;
/*!40000 ALTER TABLE `edificio` DISABLE KEYS */;
INSERT INTO `edificio` VALUES (1,'General Cruz 222','Hucke');
/*!40000 ALTER TABLE `edificio` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `nombres`
--

DROP TABLE IF EXISTS `nombres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `nombres` (
  `Codigo` varchar(100) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`Codigo`,`Nombre`),
  CONSTRAINT `nombres_asignatura_FK` FOREIGN KEY (`Codigo`) REFERENCES `asignatura` (`Codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `nombres`
--

LOCK TABLES `nombres` WRITE;
/*!40000 ALTER TABLE `nombres` DISABLE KEYS */;
INSERT INTO `nombres` VALUES ('INF-111','Fundamentos de Matematicas'),('INF-112','Algebra'),('INF-114','Desarrollo Personal'),('INF-115','Introduccion a la Ingenieria informatica'),('INF-116','Fundamentos de Programacion'),('INF-213','Ingles I');
/*!40000 ALTER TABLE `nombres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `piso`
--

DROP TABLE IF EXISTS `piso`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `piso` (
  `Numero_Piso` int NOT NULL,
  `ID_Edificio` int NOT NULL,
  PRIMARY KEY (`Numero_Piso`,`ID_Edificio`),
  KEY `piso_edificio_FK` (`ID_Edificio`),
  CONSTRAINT `piso_edificio_FK` FOREIGN KEY (`ID_Edificio`) REFERENCES `edificio` (`ID_Edificio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `piso`
--

LOCK TABLES `piso` WRITE;
/*!40000 ALTER TABLE `piso` DISABLE KEYS */;
INSERT INTO `piso` VALUES (1,1),(2,1),(3,1),(4,1),(5,1);
/*!40000 ALTER TABLE `piso` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profesor`
--

DROP TABLE IF EXISTS `profesor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `profesor` (
  `Correo` varchar(100) NOT NULL,
  `Nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`Correo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profesor`
--

LOCK TABLES `profesor` WRITE;
/*!40000 ALTER TABLE `profesor` DISABLE KEYS */;
INSERT INTO `profesor` VALUES ('profesor1@uv.cl','profesor1'),('profesor2@uv.cl','profesor2'),('profesor3@uv.cl','profesor3'),('profesor4@uv.cl','profesor4'),('profesor5@uv.cl','profesor5'),('profesor6@uv.cl','profesor6');
/*!40000 ALTER TABLE `profesor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sala`
--

DROP TABLE IF EXISTS `sala`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sala` (
  `ID_Edificio` int NOT NULL,
  `Numero_Piso` int NOT NULL,
  `Numero_Sala` int NOT NULL,
  PRIMARY KEY (`ID_Edificio`,`Numero_Piso`,`Numero_Sala`),
  KEY `sala_piso_FK` (`Numero_Piso`,`ID_Edificio`),
  CONSTRAINT `sala_piso_FK` FOREIGN KEY (`Numero_Piso`, `ID_Edificio`) REFERENCES `piso` (`Numero_Piso`, `ID_Edificio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sala`
--

LOCK TABLES `sala` WRITE;
/*!40000 ALTER TABLE `sala` DISABLE KEYS */;
INSERT INTO `sala` VALUES (1,1,111),(1,1,112),(1,1,113),(1,2,211),(1,2,212),(1,2,213),(1,3,311),(1,3,312),(1,3,313),(1,4,411),(1,4,412),(1,4,413),(1,5,511),(1,5,512),(1,5,513);
/*!40000 ALTER TABLE `sala` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sala_seccion`
--

DROP TABLE IF EXISTS `sala_seccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sala_seccion` (
  `ID_Edificio` int NOT NULL,
  `Numero_Piso` int NOT NULL,
  `Numero_Sala` int NOT NULL,
  `ID_Seccion` int NOT NULL,
  PRIMARY KEY (`ID_Seccion`,`ID_Edificio`,`Numero_Piso`,`Numero_Sala`),
  KEY `sala_seccion_sala_FK` (`ID_Edificio`,`Numero_Piso`,`Numero_Sala`),
  CONSTRAINT `sala_seccion_sala_FK` FOREIGN KEY (`ID_Edificio`, `Numero_Piso`, `Numero_Sala`) REFERENCES `sala` (`ID_Edificio`, `Numero_Piso`, `Numero_Sala`),
  CONSTRAINT `sala_seccion_seccion_FK` FOREIGN KEY (`ID_Seccion`) REFERENCES `seccion` (`ID_Seccion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sala_seccion`
--

LOCK TABLES `sala_seccion` WRITE;
/*!40000 ALTER TABLE `sala_seccion` DISABLE KEYS */;
INSERT INTO `sala_seccion` VALUES (1,1,111,1),(1,1,112,2),(1,1,113,3),(1,2,211,4),(1,2,212,5),(1,2,213,6),(1,3,311,7),(1,3,312,8),(1,3,313,9),(1,4,411,10),(1,4,412,11),(1,4,413,12);
/*!40000 ALTER TABLE `sala_seccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seccion`
--

DROP TABLE IF EXISTS `seccion`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seccion` (
  `ID_Seccion` int NOT NULL AUTO_INCREMENT,
  `Codigo` varchar(100) NOT NULL,
  `Correo` varchar(100) NOT NULL,
  `Sede` varchar(100) NOT NULL,
  PRIMARY KEY (`ID_Seccion`),
  KEY `seccion_profesor_FK` (`Correo`),
  KEY `seccion_asignatura_FK` (`Codigo`),
  CONSTRAINT `seccion_asignatura_FK` FOREIGN KEY (`Codigo`) REFERENCES `asignatura` (`Codigo`),
  CONSTRAINT `seccion_profesor_FK` FOREIGN KEY (`Correo`) REFERENCES `profesor` (`Correo`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seccion`
--

LOCK TABLES `seccion` WRITE;
/*!40000 ALTER TABLE `seccion` DISABLE KEYS */;
INSERT INTO `seccion` VALUES (1,'INF-111','profesor1@uv.cl','valparaiso'),(2,'INF-111','profesor4@uv.cl','valparaiso'),(3,'INF-112','profesor2@uv.cl','valparaiso'),(4,'INF-112','profesor1@uv.cl','valparaiso'),(5,'INF-114','profesor3@uv.cl','valparaiso'),(6,'INF-114','profesor5@uv.cl','valparaiso'),(7,'INF-115','profesor4@uv.cl','valparaiso'),(8,'INF-115','profesor2@uv.cl','valparaiso'),(9,'INF-116','profesor3@uv.cl','valparaiso'),(10,'INF-116','profesor5@uv.cl','valparaiso'),(11,'INF-213','profesor6@uv.cl','valparaiso'),(12,'INF-213','profesor6@uv.cl','valparaiso');
/*!40000 ALTER TABLE `seccion` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tabla_drop`
--

DROP TABLE IF EXISTS `tabla_drop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tabla_drop` (
  `ID_Drop` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`ID_Drop`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tabla_drop`
--

LOCK TABLES `tabla_drop` WRITE;
/*!40000 ALTER TABLE `tabla_drop` DISABLE KEYS */;
/*!40000 ALTER TABLE `tabla_drop` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'proyecto-pw'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-22 11:06:44
