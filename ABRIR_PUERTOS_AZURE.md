# 🔓 Abrir Puertos en Azure VM

## Opción 1: Azure CLI (Desde tu máquina local o la VM)

### Instalar Azure CLI (si no lo tienes):
```bash
# En tu máquina local (Windows)
winget install -e --id Microsoft.AzureCLI

# O descargar desde: https://aka.ms/installazurecliwindows
```

### Comandos para abrir puertos:

```bash
# 1. Iniciar sesión en Azure
az login

# 2. Abrir puerto 3000 (API)
az vm open-port --port 3000 --resource-group TU_RESOURCE_GROUP --name mv-pivi-social-db-ubuntu-dev-eastus

# 3. Abrir puerto 27018 (MongoDB - opcional, solo si quieres acceso externo)
az vm open-port --port 27018 --resource-group TU_RESOURCE_GROUP --name mv-pivi-social-db-ubuntu-dev-eastus

# Verificar puertos abiertos
az vm show --resource-group TU_RESOURCE_GROUP --name mv-pivi-social-db-ubuntu-dev-eastus --show-details --query "networkProfile.networkSecurityGroup.id" -o tsv
```

**Nota:** Reemplaza `TU_RESOURCE_GROUP` con el nombre de tu grupo de recursos.

## Opción 2: Azure Portal (Interfaz Web)

### Pasos en el Portal:

1. **Ir a Azure Portal**: https://portal.azure.com

2. **Buscar tu VM**:
   - Busca "Virtual machines" o "mv-pivi-social-db-ubuntu-dev-eastus"

3. **Ir a Networking** (Redes):
   - En el menú lateral, selecciona "Networking"

4. **Agregar regla de puerto entrante**:
   - Click en "Add inbound port rule"
   - **Destination port ranges**: `3000`
   - **Name**: `Allow-API-Port-3000`
   - **Protocol**: TCP
   - **Action**: Allow
   - **Priority**: 1000 (o el que prefieras)
   - Click en "Add"

5. **(Opcional) Puerto 27018 para MongoDB**:
   - Solo si quieres acceso externo a MongoDB
   - Mismo proceso pero con puerto `27018`

6. **Guardar cambios** (se aplican automáticamente)

## Opción 3: Desde la VM con UFW (Firewall local)

También puedes verificar/configurar el firewall en la VM misma:

```bash
# Verificar UFW
sudo ufw status

# Si está activo, permitir puertos
sudo ufw allow 3000/tcp
sudo ufw allow 27018/tcp

# Reiniciar UFW si es necesario
sudo ufw reload
```

**⚠️ Nota**: Azure Network Security Group (NSG) es el que realmente controla el acceso. UFW es adicional.

## Verificar puertos abiertos:

### Desde Azure Portal:
- Ve a tu VM → Networking
- Verás todas las reglas de puerto abiertas

### Desde Azure CLI:
```bash
az network nsg rule list \
  --resource-group TU_RESOURCE_GROUP \
  --nsg-name NSG_NAME \
  --query "[?destinationPortRanges==\`3000\`]"
```

## Probar que funciona:

### Desde tu máquina local:
```bash
# Reemplaza IP_PUBLICA con la IP de tu VM
curl http://IP_PUBLICA:3000/api/users
```

### Obtener IP pública de la VM:
```bash
# Desde Azure CLI
az vm list-ip-addresses --name mv-pivi-social-db-ubuntu-dev-eastus --resource-group TU_RESOURCE_GROUP

# O desde Azure Portal
# Ve a tu VM → Overview → Public IP address
```

## Puertos necesarios:

| Puerto | Servicio | ¿Obligatorio? |
|--------|----------|---------------|
| 3000 | API Node.js | ✅ SÍ |
| 27018 | MongoDB | ❌ NO (solo si quieres acceso externo) |
| 22 | SSH | ✅ Ya debería estar abierto |

## Resumen rápido:

**Más fácil**: Azure Portal → VM → Networking → Add inbound port rule → Puerto 3000

**Más rápido (si tienes CLI)**: `az vm open-port --port 3000 --resource-group ... --name ...`

