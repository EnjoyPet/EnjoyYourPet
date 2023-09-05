-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-09-2023 a las 08:55:25
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `enjoyourpet`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `carrito`
--

CREATE TABLE `carrito` (
  `id_carrito` int(11) NOT NULL,
  `ticket` char(8) DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `tipo_pago` varchar(60) DEFAULT NULL,
  `estado_tx` varchar(60) DEFAULT NULL,
  `comprado_por` int(11) NOT NULL,
  `producto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categoria`
--

CREATE TABLE `categoria` (
  `id_categoria` int(11) NOT NULL,
  `nombre` varchar(60) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categoria`
--

INSERT INTO `categoria` (`id_categoria`, `nombre`, `descripcion`) VALUES
(1, 'Cachorro Grande', 'Cachorros de razas de tamaño grandes'),
(2, 'Cachorro Mediano', 'Cachorros de razas de tamaño medianas'),
(3, 'Cachorro Chico', 'Cachorros de razas de tamaño chico'),
(4, 'Perro Adulto', 'Perro de edad avanzada, en la adultez'),
(5, 'Gato', 'felino domestico'),
(6, 'Ave', 'Pájaro domestico');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mascota`
--

CREATE TABLE `mascota` (
  `id_mascota` int(11) NOT NULL,
  `nombre` varchar(60) DEFAULT NULL,
  `fecha_nacimiento` date DEFAULT NULL,
  `edad` int(11) DEFAULT NULL,
  `color` varchar(30) DEFAULT NULL,
  `especie` int(11) NOT NULL,
  `peso` varchar(30) DEFAULT NULL,
  `raza` varchar(30) DEFAULT NULL,
  `genero` char(1) DEFAULT NULL,
  `descripcion_vacunacion` varchar(255) DEFAULT NULL,
  `usuario_mascota` int(11) NOT NULL,
  `collar` char(6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mascota_collar`
--

CREATE TABLE `mascota_collar` (
  `id_mascota` int(11) NOT NULL,
  `cod_collar` char(6) NOT NULL,
  `creado_en` datetime DEFAULT NULL,
  `fecha_vencimiento` datetime DEFAULT NULL,
  `estado` varchar(30) DEFAULT 'No especificado'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mascota_especie`
--

CREATE TABLE `mascota_especie` (
  `id_especie` int(11) NOT NULL,
  `nombre` varchar(60) DEFAULT NULL,
  `descripcion` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `post`
--

CREATE TABLE `post` (
  `id_post` int(11) NOT NULL,
  `titulo_post` varchar(50) NOT NULL,
  `fecha_creacion_post` date DEFAULT current_timestamp(),
  `contenido_post` varchar(500) NOT NULL,
  `imagen_post` blob DEFAULT NULL,
  `post_creado_por` int(11) NOT NULL,
  `categoria_post` int(11) NOT NULL,
  `meGusta_post` int(11) NOT NULL,
  `noMeGusta_post` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto`
--

CREATE TABLE `producto` (
  `id_producto` int(11) NOT NULL,
  `nombre` varchar(60) DEFAULT NULL,
  `codigo` char(14) DEFAULT NULL,
  `lote` char(8) DEFAULT NULL,
  `dimensiones` varchar(140) DEFAULT NULL,
  `stock` int(11) DEFAULT NULL,
  `precio` float DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(120) DEFAULT NULL,
  `tipo_identificacion` int(11) NOT NULL DEFAULT 1,
  `identificacion` varchar(11) DEFAULT NULL,
  `correo` varchar(120) NOT NULL,
  `contrasenia` varchar(255) NOT NULL,
  `celular` char(15) DEFAULT NULL,
  `genero` char(1) DEFAULT NULL,
  `telefono` varchar(12) DEFAULT NULL,
  `direccion` varchar(140) DEFAULT NULL,
  `rol` int(11) NOT NULL DEFAULT 3
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nombre`, `tipo_identificacion`, `identificacion`, `correo`, `contrasenia`, `celular`, `genero`, `telefono`, `direccion`, `rol`) VALUES
(0, 'EnjoyYourPet', 1, '--', 'Admin@Admin.Admin', '$2a$08$UXhfYH6aGw/5BZTLmhHu7edAPCwVUXfDqr4yjoea9RlLTWqJMrLh6', '--', '-', '--', '--', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_rol`
--

CREATE TABLE `usuario_rol` (
  `id_rol` int(11) NOT NULL,
  `nombre` varchar(60) DEFAULT NULL,
  `descripcion` varchar(140) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario_rol`
--

INSERT INTO `usuario_rol` (`id_rol`, `nombre`, `descripcion`) VALUES
(1, 'Administrador', ''),
(2, 'Usuario', '');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario_tipo_identificacion`
--

CREATE TABLE `usuario_tipo_identificacion` (
  `id_tid` int(11) NOT NULL,
  `nombre` varchar(60) DEFAULT NULL,
  `descripcion` varchar(140) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuario_tipo_identificacion`
--

INSERT INTO `usuario_tipo_identificacion` (`id_tid`, `nombre`, `descripcion`) VALUES
(1, 'C.C', 'Cedula de Ciudadanía'),
(2, 'C.E', 'Cedula de Extranjería'),
(3, 'NIT', 'Numero de Identificación Tributaria'),
(4, 'T.I', 'Tarjeta de Identidad');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD PRIMARY KEY (`id_carrito`),
  ADD KEY `carrito_producto` (`producto`),
  ADD KEY `carrito_usuario` (`comprado_por`);

--
-- Indices de la tabla `categoria`
--
ALTER TABLE `categoria`
  ADD PRIMARY KEY (`id_categoria`);

--
-- Indices de la tabla `mascota`
--
ALTER TABLE `mascota`
  ADD PRIMARY KEY (`id_mascota`),
  ADD KEY `mascota_mascota_especie` (`especie`),
  ADD KEY `mascota_usuario` (`usuario_mascota`);

--
-- Indices de la tabla `mascota_collar`
--
ALTER TABLE `mascota_collar`
  ADD PRIMARY KEY (`cod_collar`),
  ADD KEY `mascota_id_mascota_mascota_collar_id_mascota` (`id_mascota`);

--
-- Indices de la tabla `mascota_especie`
--
ALTER TABLE `mascota_especie`
  ADD PRIMARY KEY (`id_especie`);

--
-- Indices de la tabla `post`
--
ALTER TABLE `post`
  ADD PRIMARY KEY (`id_post`),
  ADD KEY `post_categoria` (`categoria_post`),
  ADD KEY `post_usuario` (`post_creado_por`);

--
-- Indices de la tabla `producto`
--
ALTER TABLE `producto`
  ADD PRIMARY KEY (`id_producto`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD KEY `usuario_usuario_rol` (`rol`),
  ADD KEY `usuario_usuario_tipo_identificacion` (`tipo_identificacion`);

--
-- Indices de la tabla `usuario_rol`
--
ALTER TABLE `usuario_rol`
  ADD PRIMARY KEY (`id_rol`);

--
-- Indices de la tabla `usuario_tipo_identificacion`
--
ALTER TABLE `usuario_tipo_identificacion`
  ADD PRIMARY KEY (`id_tid`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `carrito`
--
ALTER TABLE `carrito`
  MODIFY `id_carrito` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `categoria`
--
ALTER TABLE `categoria`
  MODIFY `id_categoria` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `mascota`
--
ALTER TABLE `mascota`
  MODIFY `id_mascota` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `mascota_especie`
--
ALTER TABLE `mascota_especie`
  MODIFY `id_especie` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `post`
--
ALTER TABLE `post`
  MODIFY `id_post` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `producto`
--
ALTER TABLE `producto`
  MODIFY `id_producto` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT de la tabla `usuario_rol`
--
ALTER TABLE `usuario_rol`
  MODIFY `id_rol` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `usuario_tipo_identificacion`
--
ALTER TABLE `usuario_tipo_identificacion`
  MODIFY `id_tid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `carrito`
--
ALTER TABLE `carrito`
  ADD CONSTRAINT `carrito_producto` FOREIGN KEY (`producto`) REFERENCES `producto` (`id_producto`),
  ADD CONSTRAINT `carrito_usuario` FOREIGN KEY (`comprado_por`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `mascota`
--
ALTER TABLE `mascota`
  ADD CONSTRAINT `mascota_mascota_especie` FOREIGN KEY (`especie`) REFERENCES `mascota_especie` (`id_especie`),
  ADD CONSTRAINT `mascota_usuario` FOREIGN KEY (`usuario_mascota`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `mascota_collar`
--
ALTER TABLE `mascota_collar`
  ADD CONSTRAINT `mascota_id_mascota_mascota_collar_id_mascota` FOREIGN KEY (`id_mascota`) REFERENCES `mascota` (`id_mascota`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `post`
--
ALTER TABLE `post`
  ADD CONSTRAINT `post_categoria` FOREIGN KEY (`categoria_post`) REFERENCES `categoria` (`id_categoria`),
  ADD CONSTRAINT `post_usuario` FOREIGN KEY (`post_creado_por`) REFERENCES `usuario` (`id_usuario`);

--
-- Filtros para la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD CONSTRAINT `usuario_usuario_rol` FOREIGN KEY (`rol`) REFERENCES `usuario_rol` (`id_rol`),
  ADD CONSTRAINT `usuario_usuario_tipo_identificacion` FOREIGN KEY (`tipo_identificacion`) REFERENCES `usuario_tipo_identificacion` (`id_tid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
